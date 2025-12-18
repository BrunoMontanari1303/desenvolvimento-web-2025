# Logix — Sistema de Gerenciamento de Transporte (TMS)
Repositórios

Link do Back End no Git:
https://github.com/BrunoMontanari1303/BackEndDevWeb

Link do Front End no Git:
https://github.com/BrunoMontanari1303/FrontEndDevWeb

Descrição do Projeto

O Logix é um sistema web (TMS) voltado para gerenciamento de pedidos de transporte, permitindo cadastrar e acompanhar pedidos (shipments), além de manter dados de veículos e motoristas. O objetivo é dar mais controle e visibilidade ao fluxo de transporte, reduzindo retrabalho e centralizando as informações em um único ambiente.

Arquitetura

A arquitetura segue o modelo SPA + API: o Front consome uma API REST no Back via Axios, usando JWT (Bearer Token) para autenticação, CSP para segurança modesta e RBAC (controle por papéis) para autorização. O Back é organizado em camadas (routes → controllers → services → repositories) e persiste dados em PostgreSQL usando a lib pg.

Como Executar o Projeto
Pré-requisitos

Node.js 18+ (recomendado LTS)

PostgreSQL 13+

npm

Back-end (API)

Para executar, acessar a pasta BackEndDevWeb e executar:

npm install


Em seguida, configurar as variáveis de ambiente editando o arquivo .env, principalmente:

PGHOST

PGPORT

PGDATABASE

PGUSER

PGPASSWORD

JWT_SECRET

Para criar as tabelas, utilizar o comando:

npm run init-db


O schema está localizado em src/database/banco.sql.

Para subir a API, executar:

npm start


A API está disponível em:
https://backenddevweb.onrender.com

Utiliza por padrão a porta 3000, configurável no .env.

Como alternativa opcional, é possível realizar um reset completo do banco utilizando:

npm run reset-database


Esse comando realiza DROP e CREATE do banco e reaplica o banco.sql, apagando o banco configurado em PGDATABASE.

Front-end (Web)

Para executar, acessar a pasta FrontEndDevWeb e executar:

npm install
npm run build


O front-end está disponível em:
https://logix-rho.vercel.app

Utiliza a porta padrão 5173 do Vite.

Variáveis de Ambiente
Back-end

PORT=3000

JWT_SECRET

FRONTEND_URL=https://logix-rho.vercel.app/

PGHOST

PGPORT=5432

PGDATABASE

PGUSER

PGPASSWORD

Front-end

O front-end não utiliza variáveis de ambiente.

Controle de Acesso (RBAC)

O sistema utiliza controle de acesso por papéis (RBAC), sendo definidos os seguintes perfis:

ADMIN (1): responsável pela administração total do sistema, como gerenciamento de usuários

USER (2): representando o cliente ou usuário padrão, responsável por criar e acompanhar pedidos

GESTOR (3): representando a transportadora ou gestor, responsável por cadastrar veículos e motoristas e aceitar pedidos

Usuários de Teste

ADMINISTRADOR:
login: admin@logix.local

senha: admin123

CLIENTE (USER):
login: cliente@logix.local

senha: Teste@123

TRANSPORTADORA (GESTOR):
login: gestor@logix.local

senha: Teste@123

API — Endpoints Principais

POST /auth/login — sem autenticação — login e retorno do token

POST /auth/register — sem autenticação — criação de usuários USER ou GESTOR

PATCH /me — com autenticação — atualização do próprio perfil

GET /usuarios — autenticação ADMIN — listar usuários

GET /usuarios/by-email — autenticação ADMIN — busca por e-mail

GET /usuarios/:id — autenticação SELF ou ADMIN — busca de usuários

PATCH /usuarios/:id — autenticação SELF ou ADMIN — atualização de usuários

POST /usuarios — autenticação ADMIN — criação de usuários

DELETE /usuarios/:id — autenticação ADMIN — remoção de usuários

GET /veiculos — autenticação ADMIN ou GESTOR — listagem

GET /veiculos/:id — autenticação ADMIN ou GESTOR — detalhamento

POST /veiculos — autenticação ADMIN ou GESTOR — criação

PATCH /veiculos/:id — autenticação ADMIN ou GESTOR — atualização

DELETE /veiculos/:id — autenticação ADMIN ou GESTOR — remoção

GET /motoristas — autenticação ADMIN ou GESTOR — listagem

GET /motoristas/:id — autenticação ADMIN ou GESTOR — detalhamento

POST /motoristas — autenticação ADMIN ou GESTOR — criação

PATCH /motoristas/:id — autenticação ADMIN ou GESTOR — atualização

DELETE /motoristas/:id — autenticação ADMIN ou GESTOR — remoção

GET /pedidos — autenticação para qualquer papel

GET /pedidos/:id — autenticação para qualquer papel

POST /pedidos — autenticação para qualquer papel

PATCH /pedidos/:id — autenticação ADMIN ou GESTOR — atualização

PATCH /pedidos/:id/aceitar — autenticação GESTOR — aceitar pedidos

DELETE /pedidos/:id — autenticação ADMIN — remoção