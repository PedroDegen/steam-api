# Steam Games API

## Objetivo do projeto

Aplicação de estudo para coletar dados de jogos, armazená-los em um banco próprio e
disponibilizá-los por uma API consumida por um frontend.

Arquitetura atual:

Steam Web API
→ Node.js
→ Prisma
→ PostgreSQL
→ Express
→ Frontend

No futuro, o catálogo poderá incluir jogos que não estejam na Steam. A Steam continuará
sendo uma fonte de dados, mas não será a identidade principal do catálogo.

---

## Objetivo de aprendizado

O projeto deve avançar de forma incremental e didática.

Antes de adicionar uma tecnologia ou realizar uma alteração importante:

1. explicar o que será feito;
2. explicar para que serve a tecnologia;
3. explicar como ela se encaixa na arquitetura;
4. fazer pequenas alterações por vez;
5. explicar o código criado;
6. não antecipar etapas futuras;
7. não reestruturar o projeto sem explicar antes.

Sempre priorizar código simples e fácil de entender.

---

## Tecnologias atuais

- Node.js 22.19.0;
- JavaScript com ES Modules;
- fetch nativo do Node.js e do navegador;
- Express 5.2.1;
- PostgreSQL;
- Prisma 7.10.0;
- dotenv para variáveis de ambiente.

O Prisma permanece na versão 7 porque o Prisma 8 exige uma versão mais nova do Node.js.
Não adicionar novas tecnologias antes que sejam necessárias para a etapa atual.

---

## Estrutura principal

- `backend/src/servidor.js`: servidor Express e endpoints da API;
- `backend/src/steamApi.js`: consultas e normalização dos dados da Steam;
- `backend/src/prismaClient.js`: conexão reutilizável entre Prisma e PostgreSQL;
- `backend/src/senha.js`: criação de hash de senha com `scrypt` e salt aleatório;
- `backend/scripts/adicionarJogo.js`: busca e salva somente um jogo por execução;
- `frontend/public/html`: páginas HTML;
- `frontend/public/css`: estilos das páginas;
- `frontend/public/js`: JavaScript executado no navegador;
- `backend/prisma/schema.prisma`: models do banco;
- `prisma7.config.ts`: configuração do Prisma;
- `backend/generated/prisma`: Prisma Client gerado e ignorado pelo Git.

O backend fica em `backend`, o frontend em `frontend` e as configurações compartilhadas
permanecem na raiz do projeto.

---

## Steam Web API

Endpoint usado para obter a lista de jogos:

```text
GET https://api.steampowered.com/IStoreService/GetAppList/v1/
```

Parâmetros relevantes:

- `key`;
- `max_results`;
- `last_appid`.

A chave fica somente na variável de ambiente `STEAM_API_KEY`.

Os dados básicos retornados incluem `appid`, `name`, `last_modified` e
`price_change_number`. `backend/src/steamApi.js` também consulta e normaliza detalhes do jogo.

A imagem principal utiliza o formato:

```text
https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{APPID}/header.jpg
```

Somente a URL da imagem é armazenada.

### Paginação e coleta

O endpoint informa `have_more_results` e `last_appid`. A paginação automática ainda não
foi implementada.

Não consultar a Steam a cada acesso do frontend. O fluxo desejado é:

Steam → processo de coleta → PostgreSQL

Depois:

Frontend → API própria → PostgreSQL

Novas importações, paginação automática e população em massa continuam adiadas. Quando a
coleta for retomada, começar com poucos registros e aumentar gradualmente.

---

## Banco de dados e Prisma

O PostgreSQL possui as tabelas `jogos` e `usuarios`.

### Model `jogos`

Campos atuais:

- `id`: identificador interno gerado pelo PostgreSQL;
- `appid`: identificador da Steam, único e atualmente obrigatório;
- `nome`;
- `imageUrl`;
- `sinopse`;
- `idadeMinima`;
- `desenvolvedoras`;
- `publicadoras`;
- `generos`;
- `dataLancamento`;
- `preco`.

Os atributos `@map` do Prisma ligam os nomes camelCase às colunas existentes no banco.
`dataLancamento` é normalizada como uma data UTC; valores ausentes ou inválidos resultam
em `null`.

O banco contém atualmente:

1. Counter-Strike — `id` 1 e `appid` 10;
2. Team Fortress Classic — `id` 2 e `appid` 20.

O `id` do PostgreSQL é a identidade oficial do catálogo. `appid` não deve ser usado como
chave principal das futuras relações.

### Model `usuarios`

A estrutura de usuários existe no banco e no Prisma, com `id`, `nome`, `email` único,
`senhaHash` e `criadoEm`. O cadastro já usa `backend/src/senha.js` para criar um hash da
senha com `scrypt` e salt aleatório antes de salvar o usuário. Login e autenticação ainda
não foram implementados.

---

## API Express

O servidor é iniciado com:

```powershell
npm run api
```

Endereço local:

```text
http://localhost:3000
```

Endpoints atuais:

- `GET /`: confirma que a API está funcionando;
- `GET /games`: lista os jogos ordenados pelo `id`;
- `GET /games/:id`: consulta um jogo pelo `id` interno;
- `POST /usuarios`: valida e cadastra um usuário;
- `GET /infousuarios`: lista usuários sem retornar o hash da senha.

`GET /games/:id` responde com:

- status 400 para IDs inválidos;
- status 404 quando o jogo não existe;
- status 500 para falhas inesperadas.

`POST /usuarios` recebe `nome`, `email` e `senha` em JSON. O backend valida os três campos,
remove espaços das extremidades de nome e e-mail, converte o e-mail para minúsculas e
armazena somente o hash da senha. Responde com status 201 e dados públicos do usuário em
caso de sucesso, 400 para dados inválidos, 409 para e-mail já cadastrado e 500 para falhas
inesperadas. `GET /infousuarios` retorna `id`, `nome`, `email` e `criadoEm`.

O Express também serve os arquivos da pasta `frontend/public`, permitindo que frontend e API
utilizem a mesma origem.

---

## Frontend demonstrativo

A Etapa 10 está em andamento.

Páginas atuais:

- `frontend/public/html/main.html`: catálogo de jogos;
- `frontend/public/html/cadastro.html`: formulário de cadastro com nome, e-mail e senha;
- `frontend/public/css/cadastro.css`: estilos e mensagens do formulário;
- `frontend/public/js/cadastro.js`: envio do formulário para a API e exibição do resultado.

O catálogo não possui jogos escritos diretamente no HTML. O fluxo atual é:

`main.html`
→ carrega `frontend/public/js/main.js`
→ executa `fetch("/games")`
→ recebe os jogos da API
→ cria o contador e os cartões no navegador

Os cartões usam `nome`, `imageUrl`, `sinopse` e `generos` retornados pela API. Existem
mensagens para carregamento, catálogo vazio, imagem ausente e falha na consulta.

O formulário de cadastro envia `POST /usuarios` com `fetch` e JSON. Durante a requisição,
o botão fica desabilitado; a resposta aparece na página como sucesso ou erro. Após o
sucesso, os campos são limpos. O cadastro não inicia sessão e não há login ou autenticação.

Para testar a integração completa, executar `npm run api` e acessar:

```text
http://localhost:3000/html/main.html
http://localhost:3000/html/cadastro.html
```

O Live Server pode ser usado para visualizar alterações isoladas de HTML e CSS. Nele,
`fetch("/games")` procura o endpoint na porta do próprio Live Server e o catálogo não é
carregado. Testes que dependem da API devem usar a porta 3000.

---

## Etapas do projeto

### Concluídas no escopo atual

1. Node.js;
2. Node.js + Steam;
3. requisições HTTP nativas;
4. PostgreSQL;
5. Prisma;
6. importação inicial de dois jogos;
7. Express;
8. endpoints `GET /games` e `GET /games/:id`;
9. revisão dos dados atuais.

### Etapa atual

10. Frontend demonstrativo com catálogo e página de detalhes dos dois jogos, ainda em
    andamento;
11. Cadastro de usuários implementado no formulário e na API; login e autenticação ainda
    pendentes.

### Etapas futuras

11. conclusão da etapa de usuários com login e autenticação;
12. avaliações próprias;
13. catálogo comunitário e moderação.

---

## Decisões futuras preservadas

### Avaliações próprias

O projeto não utilizará avaliações da Steam. Usuários autenticados poderão futuramente
atribuir notas de 1 a 5 e comentários.

Regras planejadas:

- uma avaliação por usuário em cada jogo;
- o usuário poderá editar ou remover somente a própria avaliação;
- o backend validará usuário e nota;
- a média será calculada com as avaliações da própria plataforma.

### Catálogo comunitário

Usuários poderão sugerir jogos, inclusive títulos que não estejam na Steam, mas não
poderão inseri-los diretamente na tabela `jogos`.

Fluxo planejado:

Usuário envia sugestão
→ solicitação fica pendente
→ moderador aprova ou rejeita
→ somente uma solicitação aprovada gera um jogo

Quando essa etapa chegar, deverá ser avaliado separadamente renomear `appid` para
`steamAppId` e torná-lo opcional. Identificadores de diferentes lojas poderão futuramente
ser separados em uma estrutura própria. Essa normalização não deve ser antecipada.

---

## Segurança

Nunca escrever diretamente no código ou na documentação:

- Steam API Key;
- senhas do banco;
- senhas de usuários;
- outras credenciais.

Credenciais locais ficam no arquivo `.env`, que deve permanecer ignorado pelo Git. O
`.env.example` contém somente exemplos sem valores reais.

Senhas de usuários nunca devem ser armazenadas diretamente; somente hashes seguros.

---

## Regra para o Codex

Ao receber uma nova tarefa:

1. Ler este `AGENTS.md`.
2. Verificar em qual etapa o projeto está.
3. Inspecionar o projeto apenas com operações de leitura quando isso for necessário.
4. Antes de qualquer alteração em código, configuração, schema, documentação ou banco de
   dados, explicar exatamente o que pretende alterar, em quais arquivos e qual será o
   efeito.
5. Depois da explicação, parar e aguardar a validação explícita do usuário.
6. Somente considerar autorizado quando o usuário responder claramente que pode fazer a
   alteração proposta.
7. Alterar apenas o que foi apresentado e validado. Qualquer necessidade adicional deve
   ser explicada e validada separadamente.
8. Trabalhar somente na etapa solicitada.
9. Evitar adicionar tecnologias que ainda não são necessárias.
10. Não implementar antecipadamente etapas futuras.
11. Depois das alterações autorizadas, validar o resultado e explicar quais arquivos
    foram modificados e por quê.

Frases como uma dúvida, uma pergunta ou um pedido de explicação não autorizam alterações.
Mesmo quando uma mudança parecer simples, primeiro apresentar a proposta e aguardar uma
resposta explícita como `pode fazer`, `aprovado` ou outra confirmação equivalente.
