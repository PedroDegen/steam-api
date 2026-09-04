# Steam Games API

## Objetivo do projeto

Este projeto tem como objetivo criar uma aplicação que obtenha dados de jogos da Steam, filtre e armazene esses dados em um banco de dados próprio e posteriormente disponibilize esses dados através de uma API própria.

No escopo futuro, o catálogo poderá incluir também jogos que não estejam disponíveis na
Steam. A Steam continuará sendo uma fonte de dados, mas não será a única origem possível
dos jogos da plataforma.

Essa API será utilizada futuramente por um frontend que exibirá jogos e avaliações.

Arquitetura planejada:

Steam API
→ Backend Node.js
→ PostgreSQL
→ API própria
→ Frontend

---

## Objetivo de aprendizado

Este projeto também está sendo desenvolvido com objetivo de aprendizado.

Não implementar várias etapas de uma vez.

Antes de adicionar uma nova tecnologia ou fazer uma alteração importante:

1. Explicar o que será feito.
2. Explicar para que serve a tecnologia utilizada.
3. Explicar como ela se encaixa na arquitetura do projeto.
4. Fazer pequenas alterações por vez.
5. Explicar o código criado.
6. Não avançar para a próxima etapa sem necessidade.
7. Não reestruturar o projeto inteiro sem explicar antes.

Sempre priorizar código simples e fácil de entender.

---

## Tecnologias planejadas

### Backend
- Node.js
- JavaScript inicialmente

### Requisições HTTP
- Fetch nativo do Node.js

### API própria
- Express

### Banco de dados
- PostgreSQL

### ORM
- Prisma

### Configuração
- dotenv para variáveis de ambiente

Essas tecnologias ainda não devem ser instaladas todas de uma vez.

Cada uma será adicionada quando chegarmos à etapa correspondente.

---

## Steam API

Estamos utilizando a Steam Web API.

Endpoint atualmente testado:

GET https://api.steampowered.com/IStoreService/GetAppList/v1/

Este é o endpoint utilizado para obter a lista de jogos.

A requisição utiliza uma Steam Web API Key.

Exemplo de parâmetros:

- key
- max_results
- last_appid

Nunca colocar a Steam API Key diretamente no código.

A chave deverá futuramente ser armazenada em uma variável de ambiente:

STEAM_API_KEY

---

## Dados retornados atualmente pela Steam

O endpoint GetAppList retorna inicialmente dados como:

- appid
- name
- last_modified
- price_change_number

Exemplo:

{
  "appid": 220,
  "name": "Half-Life 2",
  "last_modified": 1745368545,
  "price_change_number": 37149137
}

---

## Imagens dos jogos

A imagem principal de um jogo pode ser obtida utilizando o appid.

Formato utilizado:

https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{APPID}/header.jpg

Exemplo para Half-Life 2:

appid:

220

URL:

https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/220/header.jpg

Inicialmente pretendemos armazenar apenas a URL da imagem, e não o arquivo da imagem.

---

## Banco de dados

Será utilizado PostgreSQL.

### Tabela `jogos`

Estrutura inicial criada:

```sql
CREATE TABLE jogos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  steam_app_id INTEGER UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  imagem TEXT,
  sinopse TEXT,
  idade_minima INTEGER DEFAULT 0,
  desenvolvedores TEXT[],
  publicadoras TEXT[],
  generos TEXT[],
  data_lancamento DATE,
  preco NUMERIC(10, 2)
);
```

O `id` é gerado automaticamente pelo PostgreSQL e o `steam_app_id` deve ser único.

Avaliações da Steam e avaliações dos usuários do próprio site poderão ser adicionadas
futuramente.

---

## Prisma

Prisma está sendo configurado como ORM entre Node.js e PostgreSQL.

Fluxo esperado:

Node.js
→ Prisma
→ PostgreSQL

O Prisma deverá facilitar operações no banco sem a necessidade de escrever SQL diretamente em todas as operações.

O projeto utiliza Prisma 7.10.0 porque está executando Node.js 22.19.0. O Prisma 8 não
foi adotado nesta etapa porque seu fluxo atual exige Node.js 24 ou superior.

---

## Requisições HTTP nativas

O fetch nativo do Node.js será utilizado para fazer requisições HTTP para a Steam.

Fluxo esperado:

Node.js
→ fetch
→ Steam API

O fetch substituirá no código as requisições que inicialmente foram testadas manualmente através do Postman.

Como o fetch já está disponível no Node.js utilizado pelo projeto, não é necessário instalar uma biblioteca HTTP externa.

---

## Express

Express será utilizado futuramente para criar nossa própria API.

Exemplos de endpoints planejados:

GET /games

GET /games/:id

O frontend deverá consultar nossa API, e não diretamente a Steam.

Fluxo futuro:

Frontend
→ Express
→ Prisma
→ PostgreSQL

Express ainda não foi instalado.

---

## Estratégia de coleta

Não consultar a Steam toda vez que um usuário acessar o frontend.

Fluxo desejado:

Steam API
→ processo de coleta
→ PostgreSQL

Depois:

Frontend
→ nossa API
→ PostgreSQL

Assim, o frontend não depende diretamente da disponibilidade da Steam.

---

## Paginação da Steam

O endpoint GetAppList possui paginação.

A resposta contém:

have_more_results

e:

last_appid

Se:

have_more_results = true

existem mais resultados.

O last_appid deve ser utilizado para continuar a busca na próxima requisição.

Essa funcionalidade será implementada futuramente.

Não implementar paginação enquanto estivermos apenas testando requisições simples.

---

## Estratégia de desenvolvimento

Começar sempre com poucos dados.

Exemplo:

10 jogos
→ 100 jogos
→ 1000 jogos
→ quantidades maiores

Não começar importando todo o catálogo da Steam.

---

## Etapas planejadas

### Etapa 1 — Node.js
Aprender o funcionamento básico do Node.js e confirmar que ele executa JavaScript.

### Etapa 2 — Node.js + Steam
Fazer o Node.js realizar uma requisição para a Steam e obter aproximadamente 10 jogos.

### Etapa 3 — Requisições HTTP nativas
Entender e organizar as requisições HTTP utilizando o fetch nativo do Node.js.

### Etapa 4 — PostgreSQL
Criar e entender o banco de dados.

### Etapa 5 — Prisma
Conectar Node.js ao PostgreSQL através do Prisma.

### Etapa 6 — Importação
Salvar os jogos obtidos da Steam no PostgreSQL.

### Etapa 7 — Express
Criar nossa própria API.

### Etapa 8 — Endpoints
Criar endpoints como:

GET /games

GET /games/:id

### Etapa 9 — Dados adicionais
Adicionar informações mais completas dos jogos.

### Etapa 10 — Frontend demonstrativo
Criar uma interface inicial com HTML, CSS e JavaScript puro que consuma os endpoints já
existentes e apresente os dois jogos cadastrados. A demonstração terá inicialmente uma
página de catálogo e uma página de detalhes do jogo, sem autenticação ou avaliações
funcionais.

### Etapa 11 — Usuários e autenticação
Retomar a estrutura de usuários e, de forma incremental, implementar cadastro, login e
autenticação. Senhas nunca deverão ser armazenadas diretamente.

### Etapa 12 — Avaliações próprias
Permitir que usuários autenticados avaliem os jogos da plataforma com nota e comentário,
integrando essa funcionalidade ao frontend existente.

### Etapa 13 — Catálogo comunitário e moderação
Permitir que usuários enviem solicitações de novos jogos, inclusive jogos que não estejam
na Steam. As solicitações deverão ser analisadas por um moderador antes da publicação no
catálogo.

---

## Estado atual do projeto

O projeto está localizado em:

C:\Users\pedro\projetos\steam-api

O Node.js está instalado e funcionando.

O npm está funcionando.

O projeto já foi inicializado utilizando npm.

Atualmente existem:

- package.json
- package-lock.json
- src/servidor.js
- src/steamApi.js
- src/prismaClient.js
- src/senha.js
- scripts/requizicao.js
- scripts/adicionarJogo.js
- AGENTS.md
- .gitignore
- .env local, ignorado pelo Git
- .env.example
- prisma/schema.prisma
- prisma7.config.ts
- generated/prisma, gerado automaticamente e ignorado pelo Git

Os arquivos JavaScript foram organizados antes do início da Etapa 10. O código da
aplicação e os módulos reutilizáveis ficam em `src`, enquanto os comandos manuais ficam
em `scripts`. Os caminhos dos imports e os scripts do `package.json` foram atualizados.

O arquivo `testarPrisma.js` e o comando `prisma:test` foram removidos porque serviam
apenas para a validação inicial da conexão. A integração entre Express, Prisma e
PostgreSQL agora é validada pelos endpoints da API.

O arquivo `scripts/requizicao.js` consulta a Steam e obtém aproximadamente 10 jogos utilizando
o fetch nativo do Node.js. A chave `STEAM_API_KEY` é carregada automaticamente do `.env`.

O arquivo `src/steamApi.js` busca e normaliza os detalhes dos jogos. Os nomes usados no
objeto retornado são os mesmos nomes expostos pelo model do Prisma. A data de lançamento
é convertida do texto em português retornado pela Steam para um objeto `Date` em UTC.

O arquivo `src/prismaClient.js` configura e exporta a conexão reutilizável do Prisma com o
PostgreSQL. O arquivo `scripts/adicionarJogo.js` busca e salva somente o primeiro jogo
retornado pela Steam, tratando detalhes indisponíveis e `appid` duplicado.

O Express 5.2.1 está instalado.

O PostgreSQL está instalado e a tabela `jogos` já foi criada.
O Prisma 7.10.0 e o adaptador do PostgreSQL estão instalados. A `DATABASE_URL` foi
configurada localmente e a conexão foi testada com sucesso. A tabela `jogos` contém dois
registros: Counter-Strike, com `appid` 10 e `id` 1, e Team Fortress Classic, com
`appid` 20 e `id` 2.

---

## Etapa atual

As Etapas 7 — Express, 8 — Endpoints e 9 — Dados adicionais foram concluídas no escopo
atual. O próximo avanço será a Etapa 10 — Frontend demonstrativo.

A criação do frontend foi antecipada para permitir uma demonstração com os dois jogos já
cadastrados. Usuários e autenticação passaram para a Etapa 11, e avaliações próprias para
a Etapa 12, preservando a dependência entre autenticação e avaliações.

Antes dessa reorganização, a estrutura inicial de usuários começou a ser preparada. A
tabela `usuarios` foi criada no PostgreSQL, introspectada no `prisma/schema.prisma` e o
Prisma Client foi regenerado. O arquivo `src/senha.js` também foi criado com a função
`criarHashSenha`, utilizando `scrypt` e salt aleatório. Esse trabalho permanecerá pausado:
nenhum endpoint de cadastro, login ou autenticação foi implementado.

As requisições HTTP com o fetch nativo foram organizadas, o PostgreSQL foi configurado e
a estrutura inicial da tabela `jogos` foi criada. O Node.js já está conectado ao
PostgreSQL por meio do Prisma.

As duas primeiras inserções da Etapa 6 foram realizadas de forma incremental. O primeiro
jogo foi inserido após explicação da proposta e validação explícita do usuário. O segundo
foi buscado manualmente com `buscarJogos(1, 10)` e inserido pelo usuário.

### Progresso da Etapa 5

Ambiente verificado:

- Node.js 22.19.0
- npm 11.6.2
- projeto utilizando JavaScript com ES Modules

Dependências instaladas:

- prisma 7.10.0, como dependência de desenvolvimento
- @prisma/client 7.10.0
- @prisma/adapter-pg 7.10.0
- pg 8.23.0
- dotenv 17.4.2

Arquivos criados ou atualizados nesta etapa:

- package.json, com as novas dependências
- package-lock.json, com as versões resolvidas
- .gitignore, ignorando node_modules, .env e o Prisma Client gerado
- .env.example, com exemplos para STEAM_API_KEY e DATABASE_URL
- .env local, criado pela inicialização do Prisma e ignorado pelo Git
- prisma/schema.prisma, com o generator do Prisma Client e o datasource PostgreSQL
- prisma7.config.ts, com o caminho do schema, das migrações e da DATABASE_URL
- `src/prismaClient.js`, com a configuração reutilizável do Prisma e do adaptador PostgreSQL
- `testarPrisma.js`, criado com uma consulta de leitura para testar a integração e removido
  posteriormente após essa validação passar a ser coberta pelos endpoints da API
- `src/steamApi.js`, carregando o `.env` e normalizando a data de lançamento
- `scripts/requizicao.js`, atualizado para utilizar ES Modules

Validações realizadas:

- Prisma CLI e Prisma Client confirmados na versão 7.10.0
- `prisma validate` executado com sucesso
- conexão com o PostgreSQL realizada com sucesso
- `prisma db pull` executado e um model introspectado
- Prisma Client gerado em `generated/prisma`
- consulta de contagem e listagem executada com sucesso
- tabela `jogos` confirmada com zero registros
- nenhuma tabela ou registro do banco foi alterado pelo Prisma

O model `jogos` utiliza nomes em camelCase iguais aos retornados por
`buscarDetalhesJogo`. Os atributos `@map` ligam esses nomes às colunas em snake_case ou
com nomes diferentes no PostgreSQL, sem renomear a tabela nem suas colunas.

A função `normalizarDataLancamento` converte datas como `1 nov. 2000` para um objeto
`Date` em UTC. Datas ausentes, não reconhecidas ou impossíveis resultam em `null`.

### Progresso da Etapa 6

- formato do primeiro registro explicado e revisado
- alteração validada explicitamente pelo usuário antes da implementação
- arquivo `scripts/adicionarJogo.js` criado
- script `prisma:adicionar` adicionado ao `package.json`
- Counter-Strike (`appid` 10) inserido com sucesso no PostgreSQL
- PostgreSQL gerou automaticamente o `id` 1
- Team Fortress Classic (`appid` 20) buscado utilizando `lastAppId` igual a 10
- Team Fortress Classic inserido com sucesso e recebeu o `id` 2
- consulta posterior confirmou exatamente dois registros na tabela `jogos`
- `lastAppId` representa o último `appid` recebido da Steam, e não o `id` do PostgreSQL
- duplicidades são impedidas por `appid @unique` no model e pela restrição única da
  coluna `steam_app_id` no PostgreSQL
- uma tentativa de inserir novamente o mesmo `appid` gera o erro `P2002`, tratado pelo
  arquivo `scripts/adicionarJogo.js`
- nenhuma importação em massa foi implementada
- nenhuma paginação automática foi implementada

A Etapa 6 foi encerrada neste ponto por decisão do usuário. O banco permanecerá com os
dois registros atuais — Counter-Strike (`appid` 10) e Team Fortress Classic (`appid`
20) — e eles serão utilizados para continuar o desenvolvimento do projeto.

Não serão feitas novas importações nem população em massa do banco neste momento.

O npm informou três vulnerabilidades de severidade alta na árvore de dependências.
Não foi executado `npm audit fix --force`, pois esse comando pode introduzir alterações
incompatíveis e deve ser avaliado separadamente.

### Progresso da Etapa 7

- Express 5.2.1 confirmado nas dependências do projeto
- arquivo `src/servidor.js` criado com a configuração inicial do Express
- rota de teste `GET /` criada, sem acesso ao banco de dados
- script `api` adicionado ao `package.json` para iniciar o servidor com `npm run api`

O servidor básico foi compreendido e validado antes da conexão da primeira rota ao
Prisma.

### Progresso da Etapa 8

- rota `GET /games` criada no arquivo `src/servidor.js`
- rota conectada ao Prisma para consultar a tabela `jogos`
- jogos ordenados pelo `id` em ordem crescente
- erros de consulta tratados com resposta HTTP de status 500
- endpoint realiza somente leitura e não altera registros do banco
- rota `GET /games/:id` criada para consultar um jogo pelo `id` do PostgreSQL
- IDs inválidos tratados com status HTTP 400
- jogos não encontrados tratados com status HTTP 404
- falhas inesperadas na consulta individual tratadas com status HTTP 500

Os dois endpoints planejados inicialmente para a Etapa 8 foram implementados. Qualquer
nova alteração deverá ser explicada e validada pelo usuário antes de ser realizada.

### Conclusão da Etapa 9

Os dados atuais foram revisados e considerados suficientes para o projeto neste momento.
A Etapa 9 foi concluída sem alterações no schema, no código ou nos registros do banco.

### Decisão sobre avaliações

O projeto não utilizará avaliações da Steam. Para manter uma identidade própria, as
avaliações serão criadas futuramente pelos usuários cadastrados na plataforma.

O frontend exibirá a interface de avaliação, mas o backend será responsável por validar
o usuário e a nota e por salvar os dados através do Prisma no PostgreSQL.

Planejamento inicial:

1. criar a estrutura de usuários
2. implementar cadastro e login
3. implementar autenticação
4. criar a estrutura de avaliações próprias
5. permitir notas de 1 a 5 e comentários
6. garantir apenas uma avaliação por usuário em cada jogo
7. permitir que o usuário edite ou remova somente a própria avaliação
8. calcular a média das avaliações de cada jogo
9. integrar cadastro, login e avaliação ao frontend já existente

Essas funcionalidades serão implementadas de forma incremental. A estrutura inicial da
tabela `usuarios` e a função de criação de hash já existem, mas não há cadastro, login,
autenticação ou estrutura de avaliações implementados neste momento.

### Decisão sobre catálogo comunitário

Futuramente, usuários poderão sugerir jogos para o catálogo, mas não poderão inserir
diretamente na tabela `jogos`. Cada sugestão criará uma solicitação pendente de análise.
O responsável pelo projeto será inicialmente o moderador que poderá aprovar ou rejeitar
essas solicitações.

Fluxo planejado:

Usuário envia uma sugestão
→ solicitação fica pendente
→ moderador analisa
→ solicitação é aprovada ou rejeitada
→ somente uma solicitação aprovada gera um jogo no catálogo

Uma solicitação poderá conter nome, plataforma ou loja, link oficial, justificativa e,
quando aplicável, o identificador da Steam. Jogos que não estejam na Steam também poderão
ser sugeridos e aprovados.

O campo `id` gerado pelo PostgreSQL continuará sendo o identificador interno oficial dos
jogos e será utilizado nas relações com usuários, avaliações e comentários. O `appid`
não será utilizado como identidade principal do catálogo.

No estado atual, `appid` continua obrigatório porque os dois jogos existentes vieram da
Steam. Quando o catálogo comunitário for implementado, deverá ser avaliada uma alteração
separada para renomeá-lo como `steamAppId` e torná-lo opcional. Essa mudança não foi feita
agora.

Em uma evolução posterior, identificadores de diferentes lojas poderão ser separados em
uma estrutura própria. Essa normalização não será antecipada enquanto o catálogo ainda
possuir apenas os dois jogos atuais.

A funcionalidade de catálogo comunitário e moderação ficará entre as últimas etapas do
projeto e não é necessária para o desenvolvimento básico atual.

A importação de mais jogos e a paginação automática permanecem adiadas para uma etapa
posterior.

---

## Segurança

Nunca escrever diretamente no código:

- Steam API Key
- senhas do banco
- outras credenciais

Essas informações devem ficar no arquivo local:

.env

O arquivo .env está ignorado pelo Git através do:

.gitignore

Nunca colocar credenciais reais no AGENTS.md.

---

## Regra para o Codex

Ao receber uma nova tarefa:

1. Ler este `AGENTS.md`.
2. Verificar em qual etapa o projeto está.
3. Inspecionar o projeto apenas com operações de leitura quando isso for necessário.
4. Antes de qualquer alteração em código, configuração, schema ou banco de dados,
   explicar exatamente o que pretende alterar, em quais arquivos e qual será o efeito.
5. Depois da explicação, parar e aguardar a validação explícita do usuário.
6. Somente considerar autorizado quando o usuário responder claramente que pode fazer
   a alteração proposta.
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
