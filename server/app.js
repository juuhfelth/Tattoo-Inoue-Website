import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { config, root } from './config.js';
import { hashPassword, verifyPassword } from './password.js';

const normalizeEmail = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validPassword = value => typeof value === 'string' && value.length > 0;

function requirePageAuth(req, res, next) {
if (!req.session.userId) {
return res.redirect('/');
}
next();
}
function requireApiAuth(req, res, next) {
if (!req.session.userId) {
return res.status(401).json({
message: 'Faça login para continuar.'
});
}
next();
}

export function createApp(users) {
  const app = express();
  app.disable('x-powered-by');
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    // JSON e mesma origem evitam submissao de formularios de outros sites.
    if (req.method === 'POST' && (!req.is('application/json') ||
      (req.get('origin') && req.get('origin') !== `http://${req.get('host')}`))) {
      return res.status(403).json({ message: 'Requisição não permitida.' });
    }
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  app.use(session({
    name: config.cookieName, secret: config.sessionSecret,
    resave: false, saveUninitialized: false, cookie: config.cookie
  }));
  app.get('/api/session', (req, res) => res.json({ authenticated: Boolean(req.session.userId) }));
  app.post('/api/register', async (req, res) => {
    const { name, password, confirmPassword } = req.body || {};
    const email = normalizeEmail(req.body?.email);
    if (typeof name !== 'string' || !name.trim() || !email || !validPassword(password) || !validPassword(confirmPassword)) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }
    if (!validEmail(email)) return res.status(400).json({ message: 'Informe um e-mail válido.' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'As senhas não coincidem.' });
    const hash = await hashPassword(password);
    try { users.create(name.trim(), email, hash); }
    catch (error) {
      if (users.findByEmail(email)) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
      throw error;
    }
    res.status(201).json({ message: 'Cadastro realizado com sucesso! Faça login.' });
  });
  app.post('/api/login', async (req, res, next) => {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    if (!email || !validPassword(password)) return res.status(400).json({ message: 'Preencha todos os campos.' });
    if (!validEmail(email)) return res.status(400).json({ message: 'Informe um e-mail válido.' });
    const user = users.findByEmail(email);
    if (!user || !await verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }
    req.session.regenerate(error => {
      if (error) return next(error);
      req.session.userId = user.id;
      req.session.save(error => error ? next(error) : res.json({ authenticated: true }));
    });
  });
  app.post('/api/logout', (req, res, next) => {
    req.session.destroy(error => {
      if (error) return next(error);
      res.clearCookie(config.cookieName, { path: '/', httpOnly: true, sameSite: 'lax', secure: false });
      res.json({ authenticated: false });
    });
  });
  app.use('/api', (req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));
  // Lista explicita: nunca expor banco, .env, dependencias ou codigo do servidor.

app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/portal-adm');
  }

  res.sendFile(path.join(root, 'index.html'));
});

app.get('/index.html', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/portal-adm');
  }

  res.sendFile(path.join(root, 'index.html'));
});
app.get('/portal-adm', requirePageAuth, (req, res) => {
res.sendFile(path.join(root, 'portal-adm.html'));
});

  for (const fiele of [
      'script.js',
      'auth.js',
      'portal-adm.js'
    ]) {
      app.get(`/${fiele}`, (req, res) =>
      res.sendFile(path.join(root, fiele))
    );
  }
  for (const folder of ['assets', 'css']) app.use(`/${folder}`, express.static(path.join(root, folder)));
  app.use((error, req, res, next) => {
    console.error('Falha na requisição:', error.message);
    const status = error.status === 400 || error.status === 413 ? error.status : 500;
    res.status(status).json({ message: status === 500 ? 'Não foi possível concluir. Tente novamente.' : 'Dados inválidos ou muito grandes.' });
  });
  return app;
}
