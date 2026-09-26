# Cadastro e login — Tattoo Inoue

Implementação no diretório `C:\Users\juuuh\OneDrive\Documentos\trabalhos ju\Faculdade\PI\code layout`.

## Iniciar

Use Node.js 22.13 ou superior (verificado com 22.17.1). No PowerShell:

```powershell
cd 'C:\Users\juuuh\OneDrive\Documentos\trabalhos ju\Faculdade\PI\code layout'
npm.cmd install
npm.cmd start
```

As dependências já foram instaladas nesta entrega. Mantenha o terminal aberto. Em outro terminal:

```powershell
Start-Process 'http://localhost:3000'
```

Abra sempre essa URL, não o arquivo HTML nem o Live Server. O Express entrega a página e a API na mesma origem. HTTP funciona sem certificado. O servidor escuta somente em localhost. Ctrl+C encerra o servidor; `npm.cmd start` inicia novamente. Se a porta estiver ocupada, encerre a execução anterior ou copie `.env.example` para `.env` e mude PORT; use a nova porta na URL.

## Arquivos

| Arquivo no projeto | Função |
|---|---|
| index.html (alterado) | Inclui CSS/JS de autenticação e um dialog com os dois formulários. O conteúdo anterior foi preservado. |
| auth.js | Alterna login/cadastro, valida, envia JSON, controla mensagens, foco e visibilidade do login. |
| css/auth.css | Estilo isolado do modal, usando as fontes e cores existentes. |
| server/index.js | Abre o banco e inicia o servidor local. |
| server/app.js | Rotas de cadastro, login, sessão e logout; validação e arquivos públicos permitidos. |
| server/database.js | Cria a tabela e centraliza consultas SQLite parametrizadas. |
| server/password.js | Gera e compara hashes scrypt com salt aleatório, usando node:crypto. |
| server/config.js | Centraliza porta, caminho do banco, segredo e opções do cookie. |
| package.json / package-lock.json | Comandos e dependências reproduzíveis: Express e express-session. |
| .env.example | Exemplo de configuração sem segredo real. |
| .gitignore | Exclui node_modules, .env, bancos locais e logs; permite .env.example. |
| tests/auth.test.js | Teste de integração com banco temporário separado. |
| README.md | Cópia deste guia. |

`script.js`, os CSS preexistentes, imagens e marcação da agenda não foram editados. Não há botão de logout, avatar ou nome no cabeçalho. O clique do login usa captura para impedir navegação e evitar o manipulador antigo de rolagem para `href="#"`; a agenda mantém seu comportamento anterior.

## Banco e caminho dos dados

Ao iniciar, o backend cria automaticamente `data/tattoo.sqlite` e a tabela `users`, se não existirem. O caminho é relativo à raiz do projeto, não ao terminal. A tabela tem `id`, `name`, `email` (único) e `password_hash`. Não há coluna para confirmação de senha. Não apague esse arquivo se quiser manter as contas. Reiniciar o programa não o apaga.

1. A pessoa preenche o formulário. HTML verifica campos obrigatórios e e-mail; JavaScript verifica nome, formato e confirmação.
2. `auth.js` usa `fetch` para enviar JSON a `POST /api/register`. Nome e e-mail são aparados; o e-mail fica em minúsculas. A senha não é aparada nem recebe regras de complexidade: `1234` funciona.
3. O backend repete a validação, transforma a senha em hash scrypt com salt aleatório e grava com parâmetros SQL. A restrição UNIQUE impede e-mails duplicados, inclusive em cadastros concorrentes.
4. A resposta mostra sucesso e volta ao login, sem autenticar.
5. Em `POST /api/login`, o backend normaliza o e-mail, encontra a conta e compara a senha com o hash. Senha errada mantém o modal aberto com “E-mail ou senha incorretos”.

O navegador não acessa SQLite diretamente. Não há contas ou senhas em localStorage. O servidor publica somente a página, os dois scripts públicos, CSS e assets; banco, configuração e código de backend não são servidos.

## Sessão

No login correto, o servidor regenera o identificador da sessão e guarda `userId` na memória. O navegador recebe somente o cookie `tattoo.sid`, com HttpOnly (JavaScript não pode ler), SameSite=Lax e Secure=false para HTTP local. A duração é de oito horas.

O frontend oculta o link inteiro `.link_icon__login` e fecha o modal. A agenda continua visível. A cada carregamento, `GET /api/session` verifica a sessão no servidor e reaplica essa visibilidade. Pode existir um breve instante com o ícone visível enquanto a consulta inicial termina.

Reiniciar o backend encerra todos os logins, mas preserva contas. Mesmo definindo um SESSION_SECRET fixo, as sessões continuam em memória e são perdidas no reinício. Sem configuração, um segredo aleatório é criado a cada execução.

## Testar manualmente

1. Clique no login e em Cadastre-se. Cadastre nome, um e-mail novo e senha/confirmacão `1234`. Deve aparecer sucesso e o formulário Login; o ícone ainda fica visível.
2. Tente campos vazios, e-mail inválido e senhas diferentes. Depois tente cadastrar o mesmo e-mail com maiúsculas. Todos devem ser rejeitados com mensagem.
3. Entre com senha errada: o modal permanece aberto. Entre com a correta: ele fecha; só a agenda permanece entre os dois ícones.
4. Recarregue a página: o login segue oculto. Pare e reinicie o backend: o login reaparece, mas a mesma conta ainda permite entrar.
5. Teste fechar no X, Esc e fundo escurecido. Clique dentro: não fecha. Navegue com Tab/Shift+Tab e envie com Enter. Durante requisições, envio e troca de formulário ficam desabilitados.
6. Com o formulário aberto, pare o backend e tente enviar: aparece mensagem para verificar se o servidor está iniciado. Há timeout de dez segundos. Se a página ainda não foi carregada, o próprio navegador mostra erro de conexão.

Existe uma conta criada na verificação visual: `teste.navegador@example.com`, senha `1234`. É apenas um dado local de teste.

### Logout da sessão do navegador

Na página localhost, abra F12 → Console e execute:

```javascript
fetch('/api/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'same-origin',
  body: '{}'
}).then(r => r.json()).then(console.log);
```

Deve retornar `{ authenticated: false }`. Recarregue: o login reaparece. Essa rota destrói a sessão no servidor e remove o cookie. Uma requisição de outro terminal sem o cookie do navegador não encerra a sessão do navegador.

### Testes automatizados

```powershell
cd 'C:\Users\juuuh\OneDrive\Documentos\trabalhos ju\Faculdade\PI\code layout'
npm.cmd test
```

O teste cria banco temporário e porta livre, sem alterar as contas locais. Verifica campos obrigatórios, formato, confirmação, duplicidade normalizada, hash, ausência de confirmação no banco, senha incorreta, entrada semelhante a SQL, cookie HttpOnly/SameSite, consulta da sessão, invalidação por logout, persistência ao reabrir o banco, perda da sessão ao recriar o servidor, bloqueio de arquivos privados e origem externa.

## Verificações e limites

O teste automatizado passou. No navegador foram verificados cadastro com `1234`, sucesso sem autenticação automática, senha errada, login por Enter, recarga mantendo sessão e agenda visível, retorno do login após reinício, alternância entre formulários, foco inicial e retorno ao ícone, fechamento pelo X/Esc/fundo, clique interno sem fechamento e mensagem com backend desligado. O modal de cadastro foi inspecionado com viewport 375×667; suas dimensões ficaram dentro da tela.

A preservação da página foi conferida pela remoção das três adições de autenticação do HTML e comparação com o original; os estilos e script anteriores permanecem intactos. Não foi feita comparação automatizada de pixels nem teste em todos os navegadores/dispositivos. A página original tem limitações de responsividade no cabeçalho e conteúdo, que não foram reformulados. O modal é responsivo, mas essas limitações anteriores podem dificultar alcançar o ícone em telas pequenas.

O Node 22.17.1 emite aviso de SQLite experimental; o fluxo funcionou nessa versão. As fontes Google já existentes dependem de internet. As contas ficam dentro de uma pasta OneDrive porque esse é o diretório solicitado; o .gitignore não controla sincronização do OneDrive.

## GitHub e Vercel no futuro

Nada foi publicado. Envie o código e package-lock.json ao GitHub; revise `git status` antes do commit para confirmar que .env, data e node_modules não aparecem. O .gitignore não remove arquivos que já tenham sido rastreados anteriormente.

Para publicar na Vercel será necessário:

1. Trocar SQLite em arquivo por banco remoto persistente (por exemplo PostgreSQL). Adapte `server/database.js` e as chamadas para aguardar consultas assíncronas, mantendo a normalização e restrição única. Migrar contas é uma etapa separada; os dados locais não vão ao GitHub.
2. Substituir o armazenamento de sessões em memória por store compartilhado persistente compatível com express-session.
3. Configurar segredo estável e credenciais do banco nas variáveis de ambiente da plataforma. Em produção, exigir essas variáveis, sem usar o fallback local.
4. Adaptar o ponto de entrada Express às funções da plataforma. `createApp` já está separado de `listen`, para facilitar. Configurar arquivos públicos sem expor arquivos de servidor.
5. Habilitar cookie Secure para HTTPS e configurar trust proxy adequadamente. Ajustar a verificação de Origin, hoje explicitamente HTTP local, para a origem HTTPS autorizada da publicação.
6. Reexecutar os testes no ambiente publicado e revisar proteção de autenticação para uso público (como limitação de tentativas). A configuração entregue é intencionalmente local.

SQLite em arquivo local não oferece persistência adequada nas funções da Vercel: [explicação oficial](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel). Sessões em memória são apropriadas apenas para este exercício local: [documentação Express](https://expressjs.com/en/resources/middleware/session/).
