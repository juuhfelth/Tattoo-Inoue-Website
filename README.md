# Homologação — Tattoo Inoue Website

Esta branch reúne as mudanças que serão testadas antes de entrarem na `main`. O site é executado localmente: cada pessoa abre sua própria cópia em `http://localhost:3000`.

> **Importante:** escolher `homolog` no site do GitHub não muda a branch no computador. Confira a branch no terminal antes de cada commit.

## 1. Aceitar o convite e preparar o computador

1. Aceite o convite do repositório privado usando sua própria conta do GitHub.
2. Instale o [Git](https://git-scm.com/install/) e o [Node.js](https://nodejs.org/en/download). Este projeto requer Node.js **22.13.0 ou superior**.
3. Abra o Terminal no macOS ou o Git Bash no Windows e confira:

```bash
git --version
node --version
npm --version
```

Configure o nome e o e-mail que aparecerão nos seus commits. Isso precisa ser feito apenas uma vez por computador:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

Cada pessoa usa a própria conta para se autenticar no GitHub. Não compartilhe senhas ou tokens.

## 2. Baixar o projeto pela primeira vez

No terminal, vá até a pasta onde deseja guardar o projeto. Por exemplo, no macOS:

```bash
cd ~/Documents
```

Depois, clone o repositório e selecione a branch de homologação:

```bash
git clone https://github.com/juuhfelth/Tattoo-Inoue-Website.git
cd Tattoo-Inoue-Website
git switch --track origin/homolog
git branch --show-current
```

O último comando deve mostrar `homolog`. O `git clone` cria a pasta `Tattoo-Inoue-Website` no local escolhido; não é necessário executar `git init`.

### Se o projeto já estiver no computador

Entre na pasta do projeto e use:

```bash
git fetch origin
git switch homolog
git branch --show-current
```

Se `git switch homolog` disser que a branch não existe localmente, execute `git switch --track origin/homolog` depois do `git fetch origin`.

## 3. Instalar e testar o site

Dentro da pasta `Tattoo-Inoue-Website`, instale as dependências e rode os testes:

```bash
npm ci
npm test
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. Mantenha o terminal aberto enquanto usa o site e pressione `Ctrl+C` para parar o servidor. Abra o endereço `localhost:3000`, não o arquivo `index.html` diretamente.

O banco SQLite é criado localmente em `data/tattoo.sqlite`. As contas cadastradas nesse computador não são compartilhadas pelo GitHub. A pasta `node_modules/` também é local. O arquivo `.env.example` mostra configurações opcionais; não é necessário criar `.env` para usar a porta padrão.

## 4. Começar uma nova alteração

Antes de editar, entre na pasta do projeto, selecione `homolog` e traga as mudanças mais recentes da equipe:

```bash
git switch homolog
git branch --show-current
git pull origin homolog
```

Confirme que `git branch --show-current` mostrou `homolog`. Em seguida, edite os arquivos no editor de sua preferência.

## 5. Conferir e salvar a alteração

Depois de editar, teste e examine o que mudou:

```bash
npm test
git status
git diff
```

Se precisar conferir o site no navegador, execute `npm start` e abra `http://localhost:3000`.

Quando estiver tudo certo:

```bash
git branch --show-current
git add .
git status
git commit -m "Descreve a alteração feita"
git push origin homolog
```

O primeiro comando deve mostrar `homolog`. O **commit** salva a alteração nessa branch no seu computador; o **push** envia a branch ao GitHub. Revise o resultado de `git status` antes do commit para confirmar que apenas os arquivos esperados foram incluídos.

O `.gitignore` exclui `.env`, `data/` e `node_modules/`. Não coloque senhas, tokens ou dados reais em arquivos enviados ao GitHub.

## 6. Depois do envio

Avise a pessoa responsável pela homologação sobre o que mudou e como testar. Ela pode atualizar a branch `homologa` no próprio computador, executar `npm test` e testar o site em `localhost:3000`.

Quando o conjunto de mudanças da homologação estiver aprovado, a pessoa responsável abre um Pull Request com **base `main`** e **compare `homolog`**. Assim, as alterações passam por revisão antes de entrarem na versão principal.

Se outra pessoa enviou commits para `homolog` antes do seu `git push`, atualize sua cópia com `git pull origin homolog`, resolva eventuais conflitos e tente o `git push` novamente. Não use `git push --force` nessa branch compartilhada.

## Comandos mais usados

| Comando | Função |
|---|---|
| `git branch --show-current` | Mostra em qual branch você está. |
| `git switch homolog` | Muda para a branch de homologação. |
| `git pull origin homolog` | Traz as mudanças recentes da homologação. |
| `git status` | Mostra os arquivos alterados e preparados. |
| `git diff` | Mostra as alterações ainda não preparadas. |
| `git add .` | Prepara as alterações para o commit. |
| `git commit -m "mensagem"` | Salva uma versão local das alterações. |
| `git push origin homolog` | Envia a branch de homologação ao GitHub. |

> **Permissões:** estes comandos orientam o trabalho na branch `homolog`. O GitHub só impedirá envios diretos à `main` se houver uma regra de proteção configurada para ela.
