import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../server/app.js';
import { openUsers } from '../server/database.js';

test('cadastro, validacoes, hash, sessao, logout e persistencia', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'tattoo-test-'));
  const filename = path.join(directory, 'test.sqlite');
  let users = openUsers(filename);
  let server;
  let base;
  async function start() {
    server = createApp(users).listen(0, 'localhost');
    await new Promise(resolve => server.once('listening', resolve));
    base = `http://localhost:${server.address().port}`;
  }
  async function stop() { await new Promise(resolve => server.close(resolve)); }
  async function call(route, body, cookie) {
    const response = await fetch(base + '/api/' + route, {
      method: body ? 'POST' : 'GET',
      headers: { ...(body && { 'Content-Type': 'application/json' }), ...(cookie && { Cookie: cookie }) },
      body: body ? JSON.stringify(body) : undefined
    });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie') };
  }
  const account = { name: 'Pessoa Teste', email: '  TESTE@EXAMPLE.COM ', password: '1234', confirmPassword: '1234' };
  try {
    await start();
    assert.equal((await call('session')).data.authenticated, false);
    for (const field of Object.keys(account)) assert.equal((await call('register', { ...account, [field]: '' })).status, 400);
    assert.equal((await call('register', { ...account, email: 'invalido' })).status, 400);
    assert.equal((await call('register', { ...account, confirmPassword: 'x' })).status, 400);
    assert.equal((await call('register', account)).status, 201);
    assert.equal((await call('session')).data.authenticated, false);
    assert.equal((await call('register', { ...account, email: 'teste@example.com' })).status, 409);
    const saved = users.findByEmail('teste@example.com');
    assert.match(saved.password_hash, /^scrypt:/);
    assert.notEqual(saved.password_hash, '1234');
    assert.equal(saved.confirmPassword, undefined);
    assert.equal((await call('login', { email: account.email, password: 'errada' })).data.message, 'E-mail ou senha incorretos');
    assert.equal((await call('login', { email: "x'OR(1)=1--@example.com", password: '1234' })).status, 401);
    const login = await call('login', account);
    assert.equal(login.status, 200);
    assert.match(login.cookie, /HttpOnly/);
    assert.match(login.cookie, /SameSite=Lax/);
    assert.doesNotMatch(login.cookie, /Secure/);
    const cookie = login.cookie.split(';')[0];
    assert.equal((await call('session', null, cookie)).data.authenticated, true);
    assert.equal((await call('logout', {}, cookie)).status, 200);
    assert.equal((await call('session', null, cookie)).data.authenticated, false);
    const secondCookie = (await call('login', account)).cookie.split(';')[0];
    for (const url of ['/server/config.js', '/data/tattoo.sqlite', '/.env', '/package.json']) assert.equal((await fetch(base + url)).status, 404);
    const crossOrigin = await fetch(base + '/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(account) });
    assert.equal(crossOrigin.status, 403);
    await stop(); users.close(); users = openUsers(filename); await start();
    assert.equal((await call('session', null, secondCookie)).data.authenticated, false);
    assert.equal((await call('login', account)).status, 200);
  } finally { if (server?.listening) await stop(); users.close(); rmSync(directory, { recursive: true, force: true }); }
});
