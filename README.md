# Steam Games API

Projeto de estudo para coletar dados de jogos da Steam, armazená-los em um banco
PostgreSQL e disponibilizá-los por meio de uma API própria.

## Tecnologias utilizadas

- Node.js 22
- JavaScript com ES Modules
- Fetch nativo do Node.js
- Express 5
- PostgreSQL
- Prisma 7

## Estado atual

O projeto possui:

- integração com a Steam Web API;
- conexão com PostgreSQL através do Prisma;
- endpoint para listar jogos;
- endpoint para consultar um jogo pelo ID;
- estrutura inicial da tabela de usuários;
- protótipo visual da página de cadastro.

Cadastro, login e avaliações ainda não estão funcionais.

## Requisitos

Antes de começar, instale:

- Node.js 22;
- PostgreSQL;
- Git;
- pgAdmin, caso queira administrar o banco por uma interface gráfica.

Também será necessária uma Steam Web API Key.

## Instalação

Clone o repositório e entre na pasta do projeto:

```powershell
git clone https://github.com/PedroDegen/steam-api.git
cd steam-api
```

Instale as dependências:

```powershell
npm install
```

## Variáveis de ambiente

Crie o arquivo local `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Preencha o `.env` com a sua própria chave da Steam e os dados do seu PostgreSQL:

```env
STEAM_API_KEY="sua_chave_da_steam"
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/steam_api?schema=public"
```

Cada desenvolvedor deve possuir seu próprio arquivo `.env`. Esse arquivo contém
credenciais e não deve ser enviado ao GitHub.

## Banco de dados

No pgAdmin, crie um banco de dados PostgreSQL vazio chamado `steam_api`.

Com o `.env` configurado, crie as tabelas a partir do schema do Prisma:

```powershell
npx.cmd prisma db push
```

Depois, gere o Prisma Client:

```powershell
npx.cmd prisma generate
```

Esses comandos criam a estrutura das tabelas, mas não copiam os registros de outro
computador.

## Adicionar os dois jogos iniciais

O processo atual adiciona apenas um jogo por execução e será mantido assim enquanto o
projeto trabalha com poucos dados.

Para adicionar primeiro o Counter-Strike, abra `scripts/adicionarJogo.js` e deixe a
chamada desta forma:

```js
const jogos = await buscarJogos(1);
```

Execute:

```powershell
npm run prisma:adicionar
```

Depois, altere a mesma chamada para:

```js
const jogos = await buscarJogos(1, 10);
```

Execute novamente:

```powershell
npm run prisma:adicionar
```

O segundo argumento representa o último `appid` recebido da Steam. Nesse caso, `10` é o
`appid` do Counter-Strike e não o `id` gerado pelo PostgreSQL.

Ao final, o banco deverá conter:

1. Counter-Strike, com `appid` 10;
2. Team Fortress Classic, com `appid` 20.

Se um dos jogos já estiver cadastrado, a restrição única de `steam_app_id` impedirá a
duplicação.

## Executar a API

Inicie o servidor:

```powershell
npm run api
```

O servidor ficará disponível em:

```text
http://localhost:3000
```

Endpoints disponíveis:

- `GET /` — confirma que a API está funcionando;
- `GET /games` — lista os jogos cadastrados;
- `GET /games/:id` — consulta um jogo pelo ID interno do PostgreSQL.

Exemplos:

```text
http://localhost:3000/games
http://localhost:3000/games/1
```

## Protótipo do frontend

A página de cadastro é somente um protótipo visual. Ela ainda não envia dados para a API
nem cria usuários no banco.

Para visualizá-la, abra o arquivo `public/cadastro.html` diretamente no navegador.

## Segurança

- Nunca coloque a Steam API Key diretamente no código.
- Nunca envie o arquivo `.env` ao GitHub.
- Nunca armazene senhas de usuários sem hash.
- Cada desenvolvedor deve utilizar suas próprias credenciais locais.
