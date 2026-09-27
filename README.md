# Tattoo Inoue Website

Site com HTML, CSS e JavaScript no navegador, servidor Node.js com Express e banco SQLite local.

Este guia mostra como uma pessoa convidada pode instalar o projeto, executá-lo no próprio computador e propor alterações.

## 1. Aceitar o convite

1. Crie uma conta em [github.com](https://github.com/), se ainda não tiver uma.
2. Abra o convite recebido por e-mail e entre na conta do GitHub que foi convidada.
3. Aceite o convite para acessar o repositório privado `juuhfelth/Tattoo-Inoue-Website`.

Cada pessoa usa a própria conta. O token e a senha da pessoa que criou o repositório não devem ser compartilhados.

## 2. Preparar o computador

Instale o [Git](https://git-scm.com/install/) e o [Node.js](https://nodejs.org/en/download). O projeto requer Node.js **22.13.0 ou superior**. O npm é instalado junto com o Node.js.

Abra o Terminal no macOS ou o Git Bash no Windows e confira:

```bash
git --version
node --version
npm --version
```

Configure seu nome e e-mail para identificar seus commits. Faça isso uma vez por computador:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

## 3. Baixar o projeto

Escolha no terminal a pasta onde deseja guardar o projeto. Por exemplo, no macOS:

```bash
cd ~/Documents
```

Copie a URL HTTPS em **Code → HTTPS** na página do repositório e execute:

```bash
git clone https://github.com/juuhfelth/Tattoo-Inoue-Website.git
cd Tattoo-Inoue-Website
```

O `git clone` cria a pasta `Tattoo-Inoue-Website` dentro da pasta escolhida. Em outro computador, o caminho até o projeto será diferente. Não execute `git init` depois de clonar.

Se o Git pedir autenticação, use sua própria conta do GitHub. Para uma conexão HTTPS, siga o login pelo navegador se ele aparecer; se o terminal pedir `Password`, use um token pessoal da **sua** conta, não a senha comum do GitHub. Nunca coloque o token em arquivos do projeto.

## 4. Instalar e iniciar

Execute estes comandos dentro da pasta `Tattoo-Inoue-Website`:

```bash
npm ci
npm test
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. Mantenha o terminal aberto enquanto usa o site; pressione `Ctrl+C` para parar o servidor.

Nas próximas vezes, entre novamente na pasta do projeto e execute `npm start`. Use `npm ci` novamente se o `package-lock.json` mudar.

Abra o site pelo endereço `localhost:3000`, não clicando diretamente no arquivo `index.html`: o servidor também fornece a API usada pelo cadastro e login.

### Dados e configuração local

Na primeira execução, o servidor cria `data/tattoo.sqlite` no próprio computador. Esse banco pode guardar contas cadastradas localmente e não é enviado ao GitHub. A pasta `node_modules/` também fica apenas no computador de cada pessoa.

O arquivo `.env.example` mostra configurações opcionais. Não é preciso criar `.env` para usar a porta padrão `3000`. Se precisar mudar a porta, copie `.env.example` para `.env`, altere `PORT` e abra o site nessa nova porta. Não envie `.env` ao GitHub.

## 5. Fazer uma alteração

Antes de cada nova mudança, atualize a versão principal e crie uma branch com um nome que descreva o trabalho:

```bash
git switch main
git pull
git switch -c corrige-agendamento
```

Edite os arquivos no editor de sua preferência. Depois, confira e teste:

```bash
npm test
git status
git diff
```

`git status` lista os arquivos alterados; `git diff` mostra o que mudou. Confira as alterações antes de preparar o commit.

## 6. Salvar e enviar a mudança

```bash
git add .
git status
git commit -m "Corrige o agendamento"
git push -u origin corrige-agendamento
```

Troque `corrige-agendamento` pelo nome da sua branch e escreva uma mensagem que descreva sua mudança. O **commit** salva a alteração no seu computador; o **push** envia a branch ao GitHub.

Antes do commit, confira em `git status` se apenas os arquivos esperados foram preparados. O `.gitignore` do projeto exclui `.env`, `data/` e `node_modules/`.

## 7. Abrir um Pull Request

1. Abra o repositório no GitHub.
2. Clique em **Compare & pull request** se o botão aparecer, ou em **Pull requests → New pull request**.
3. Escolha `main` como destino (**base**) e sua branch como origem (**compare**).
4. Descreva o que mudou e clique em **Create pull request**.
5. Aguarde a revisão. Se pedirem ajustes, faça outro commit na mesma branch e execute `git push`; o Pull Request será atualizado.

Depois que a mudança for incorporada, comece a próxima a partir da `main` atualizada:

```bash
git switch main
git pull
git switch -c nome-da-proxima-mudanca
```

## Comandos mais usados

| Comando | O que faz |
|---|---|
| `git status` | Mostra o estado dos arquivos. |
| `git diff` | Mostra alterações ainda não preparadas. |
| `git pull` | Traz alterações do GitHub para a branch atual. |
| `git switch -c nome` | Cria uma branch e muda para ela. |
| `git add .` | Prepara alterações para o próximo commit. |
| `git commit -m "mensagem"` | Salva uma versão local das alterações. |
| `git push` | Envia commits ao GitHub. |

## Arquivos principais

| Caminho | Função |
|---|---|
| `index.html`, `css/`, `assets/`, arquivos `.js` na raiz | Páginas e recursos do navegador. |
| `server/` | Servidor, autenticação e acesso ao banco SQLite. |
| `tests/` | Testes automatizados. |
| `package.json`, `package-lock.json` | Dependências e comandos npm. |
| `.env.example` | Exemplo de configuração local. |
| `.gitignore` | Lista de arquivos que não devem entrar nos commits. |

O repositório GitHub guarda o código. Executar `npm start` abre o site apenas no computador da pessoa, em `localhost`.
