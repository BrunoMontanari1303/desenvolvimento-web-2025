Link do Back End no Git: https://github.com/BrunoMontanari1303/BackEndDevWeb
Link do Front End no Git: https://github.com/BrunoMontanari1303/FrontEndDevWeb

- Descrição do projeto e arquitetura

O Logix é um sistema web (TMS) voltado para gerenciamento de pedidos de transporte, permitindo cadastrar e acompanhar pedidos (shipments), além de manter dados de veículos e motoristas. O objetivo é dar mais controle e visibilidade ao fluxo de transporte, reduzindo retrabalho e centralizando as informações em um único ambiente.

A arquitetura segue o modelo SPA + API: o Front consome uma API REST no Back via Axios, usando JWT (Bearer Token) para autenticação, CSP para segurança modesta e RBAC (controle por papéis) para autorização. O Back é organizado em camadas (routes → controllers → services → repositories) e persiste dados em PostgreSQL usando a lib pg.

- Como executar (passo a passo)
Pré-requisitos

Node.js 18+ (recomendado LTS)

PostgreSQL 13+

npm

1) Back-end (API)
cd BackEndDevWeb
npm install

# configurar variáveis
cp .env.example .env
# edite o .env (principalmente PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD e JWT_SECRET)

# cria as tabelas (schema está em src/database/banco.sql)
npm run init-db

# subir a API
npm start

API disponível em: http://localhost:3000

Porta padrão: PORT=3000 (configurável no .env)

Alternativa (opcional): reset completo do banco (DROP/CREATE + aplica o banco.sql) usando:

npm run reset-database

Isso apaga o banco configurado em PGDATABASE.

2) Front-end (Web)
cd FrontEndDevWeb
npm install

# criar .env
# VITE_API_URL=http://localhost:3000

npm run build

Front disponível em: https://logix-rho.vercel.app

Porta padrão do Vite: 5173

- Variáveis de ambiente usadas (.env.example)

Back: 

# API
PORT=3000
JWT_SECRET=uma-chave-forte-aqui
FRONTEND_URL=https://logix-rho.vercel.app/

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=gerenciamento
PGUSER=postgres
PGPASSWORD=postgres

Front: 

VITE_API_URL=https://backenddevweb.onrender.com

- Usuário(s) de teste e fluxos a demonstrar
Papéis (RBAC)

ADMIN (1): administração total (ex.: gerenciar usuários)

USER (2): cliente/usuário padrão (ex.: criar e acompanhar pedidos)

GESTOR (3): transportadora/gestor (ex.: cadastrar veículos/motoristas e aceitar pedidos)

Usuários de teste (login/senha):

ADMINISTRADOR: admin@logix.local / admin123

CLIENTE (USER): cliente@logix.local / Teste@123

TRANSPORTADORA (GESTOR): gestor@logix.local / Teste@123

- API — endpoints principais

Quase todos os endpoints exigem Authorization: Bearer <TOKEN> (exceto login/registro).

Método	  Rota	            Autenticação	      Papel	               Resumo

POST	  /auth/login	        Não	                —	               Login (retorna token)
POST	  /auth/register	    Não	                —	               Cria USER/GESTOR
PATCH	  /me	                Sim	             Qualquer	           Atualiza o próprio perfil
GET	      /usuarios	            Sim	              ADMIN	               Lista usuários
GET	      /usuarios/by-email    Sim	              ADMIN	               Busca usuário por e-mail
GET	      /usuarios/:id	        Sim	           SELF ou ADMIN	       Busca usuários
PATCH	  /usuarios/:id	        Sim	           SELF ou ADMIN	       Atualiza usuário
POST	  /usuarios	            Sim	              ADMIN	               Cria usuário
DELETE	  /usuarios/:id	        Sim               ADMIN	               Remove usuário
GET	      /veiculos	            Sim	           ADMIN/GESTOR	           Lista veículos 
GET	      /veiculos/:id	        Sim	           ADMIN/GESTOR	           Detalha veículo
POST	  /veiculos	            Sim	           ADMIN/GESTOR	           Cria veículo
PATCH	  /veiculos/:id	        Sim	           ADMIN/GESTOR	           Atualiza veículo
DELETE	  /veiculos/:id	        Sim	           ADMIN/GESTOR	           Remove veículo
GET	      /motoristas	        Sim	           ADMIN/GESTOR	           Lista motoristas
GET	      /motoristas/:id	    Sim	           ADMIN/GESTOR	           Detalha motorista
POST	  /motoristas	        Sim	           ADMIN/GESTOR	           Cria motorista
PATCH	  /motoristas/:id	    Sim	           ADMIN/GESTOR	           Atualiza motorista
DELETE	  /motoristas/:id	    Sim	           ADMIN/GESTOR	           Remove motorista
GET	      /pedidos	            Sim	             Qualquer	           Lista pedidos
GET	      /pedidos/:id	        Sim	             Qualquer	           Detalha pedido
POST	  /pedidos	            Sim	             Qualquer	           Cria pedido
PATCH	  /pedidos/:id	        Sim	           ADMIN/GESTOR	           Atualiza pedido
PATCH	  /pedidos/:id/aceitar	Sim	              GESTOR	           Aceita pedido
DELETE	  /pedidos/:id	        Sim	               ADMIN	           Remove pedido