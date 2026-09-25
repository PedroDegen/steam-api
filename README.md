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
- catálogo HTML que consulta a API e cria os cartões dinamicamente;
- estrutura da tabela de usuários;
- formulário de cadastro integrado à API e ao banco de dados.

O cadastro de usuários já está implementado. Login, autenticação e avaliações ainda não
estão funcionais.

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

Para adicionar primeiro o Counter-Strike, abra `backend/scripts/adicionarJogo.js` e deixe a
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
- `GET /games/:id` — consulta um jogo pelo ID interno do PostgreSQL;
- `POST /usuarios` — valida os dados e cadastra um usuário;
- `GET /infousuarios` — lista ID, nome, e-mail e data de criação dos usuários.

Exemplos:

```text
http://localhost:3000/games
http://localhost:3000/games/1
```

## Frontend demonstrativo

Com a API em execução, acesse o catálogo em:

```text
http://localhost:3000/html/main.html
```

O arquivo `frontend/public/js/main.js` faz uma requisição `GET /games` e cria o contador e os
cartões com os dados retornados pela API. Os jogos não ficam escritos diretamente no
HTML.

O Live Server pode ser usado para visualizar mudanças isoladas de HTML e CSS. Para testar
o catálogo integrado à API, utilize o endereço da porta 3000, pois `fetch("/games")`
consulta a mesma origem da página.

### Cadastro

`frontend/public/html/cadastro.html` contém o formulário com nome, e-mail e senha. O visual
fica em `frontend/public/css/cadastro.css`. O arquivo `frontend/public/js/cadastro.js`
intercepta o envio, faz uma requisição `POST /usuarios` com os dados em JSON e mostra a
mensagem retornada pela API. Durante o envio, o botão fica desabilitado; após um cadastro
bem-sucedido, o formulário é limpo.

No backend, `backend/src/servidor.js` valida nome, e-mail e senha, normaliza nome e e-mail,
gera um hash da senha com `backend/src/senha.js` e cria o usuário no PostgreSQL pelo Prisma.
A resposta de sucesso não inclui o hash. Dados inválidos retornam status 400, e-mail já
cadastrado retorna 409 e falhas inesperadas retornam 500. O endpoint `GET /infousuarios`
lista os usuários sem incluir o hash da senha.

Com o Express em execução, o formulário pode ser acessado em:

```text
http://localhost:3000/html/cadastro.html
```

O cadastro ainda não inicia uma sessão. Login e autenticação ficam para uma etapa futura.

## Segurança

- Nunca coloque a Steam API Key diretamente no código.
- Nunca envie o arquivo `.env` ao GitHub.
- Nunca armazene senhas de usuários sem hash.
- Cada desenvolvedor deve utilizar suas próprias credenciais locais.
