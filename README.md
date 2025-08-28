# Logix — Sistema de Gerenciamento de Transporte

## 1) Problema

Despachantes e coordenadores de logística, em empresas de transporte e distribuição, têm dificuldade em gerenciar e rastrear pedidos de transporte e otimizar o uso dos veículos. Isso causa atrasos nas entregas, aumento de custos operacionais e falta de visibilidade das rotas. No início, o foco será despachantes e motoristas, com o objetivo de otimizar o gerenciamento de pedidos e garantir rastreamento simples de entregas.

## 2) Atores e Decisores (quem usa / quem decide)

Usuários principais: Despachantes/Coordenadores de Logística; Motoristas; Gerentes de Transporte
Decisores/Apoiadores: Diretores de Logística; Gestores de TI; Equipe de Suporte

## 3) Casos de uso (de forma simples)

Todos: Logar/deslogar do sistema.
Manter dados cadastrais (alterar e atualizar informações pessoais e de contato).

Despachante/Coordenador de Logística: Manter (criar, visualizar, editar, remover) pedidos de transporte.
Atribuir (veículos e motoristas) a pedidos de transporte.
Consultar relatórios de status e desempenho de entregas.

Motorista: Manter (visualizar, atualizar) status dos pedidos de transporte (em andamento, concluído, atrasado).
Consultar (seus pedidos e informações de rota).
Atualizar o status da entrega (entregue, em atraso).

Gerente de Transporte: Manter (visualizar, editar) relatórios de desempenho e estatísticas de transporte.
Consultar e analisar dados de rotas e veículos (e.g., tempo de entrega, eficiência de uso de veículos).

## 4) Limites e suposições

Limites: Prazo final para entrega: 6 semanas para a primeira fatia vertical.
O sistema deve funcionar no navegador (não será disponibilizado versão mobile inicial).
O sistema não incluirá otimização automática de rotas na primeira versão.
Utilização obrigatória de Node.js para backend e PostgreSQL para o banco de dados.

Suposições: Os motoristas e despachantes terão acesso à internet estável para atualizar o status de entrega em tempo real.
O navegador utilizado será atualizado e compatível com as versões mais recentes (Chrome, Firefox, Edge).
O GitHub será usado para controle de versão e compartilhamento de código.
Equipe de suporte disponível para testar o sistema e fornecer feedback durante a fase piloto.


Plano B: Caso a internet não esteja disponível para atualizações em tempo real, o motorista poderá atualizar o status posteriormente, uma vez que a conexão for restabelecida, utilizando uma opção de atualização offline.
Se o tempo de desenvolvimento for reduzido, a primeira fatia vertical será limitada à criação e visualização de pedidos com funcionalidades simples de atribuição de veículos e motoristas, sem a necessidade de relatórios ou otimizações avançadas.

## 5) Hipóteses + validação

H-Valor: Se despachantes e motoristas puderem visualizar e atualizar status de transporte, então a eficiência no controle das entregas melhora.
Validação (valor): Teste com despachantes e motoristas; sucesso se a maioria conseguir atualizar e consultar status corretamente.

Com Node.js e PostgreSQL, a criação e visualização de pedidos de transporte leva até 2 segundos para a maioria das interações.

Validação (viabilidade): Medição no protótipo; sucesso se o sistema responder em 2 segundos ou menos na maioria das interações (9 de cada 10).

## 6) Fluxo principal e primeira fatia

**Fluxo principal (curto):**  
1) Despachante faz login → 2) Cria um pedido de transporte (origem, destino, tipo de carga) → 3) Sistema salva o pedido no banco de dados → 4) Lista de pedidos de transporte é exibida com status e dados.

**Primeira fatia vertical (escopo mínimo):**  
Inclui: Tela de login, Criação de pedido de transporte, Salvar pedido no banco de dados, Mostrar lista de pedidos criados.
Critérios de aceite:

Pedido de transporte é salvo corretamente no sistema e aparece na lista.

Usuário consegue visualizar todos os pedidos de transporte cadastrados.

## 7) Esboços de algumas telas (wireframes)

1. Tela de Login

![alt text](<Login TMS.png>)

2. Tela de Criação de Pedido de Transporte

Tela para despachantes criarem um novo pedido de transporte:

![alt text](<Criação Pedido TMS-1.png>)

3. Tela de Lista de Pedidos de Transporte

A tela exibe todos os pedidos de transporte cadastrados.

![alt text](<Lista Pedidos.png>)

## 8) Tecnologias
8.1 Navegador

Navegador: HTML/CSS/JS | Vue.js (para o front-end interativo)
Armazenamento local (se usar): LocalStorage (para armazenamento de sessões ou dados temporários)
Hospedagem: Netlify ou Vercel (para deploy rápido da aplicação front-end)

8.2 Front-end (servidor de aplicação)

Front-end (servidor): Vue.js com Vue Router e Tailwind CSS (para estilização rápida e responsiva)
Hospedagem: Netlify ou Vercel (plataformas que suportam deploys automáticos e integração com GitHub)

8.3 Back-end (API/servidor)

Back-end (API): Node.js com Express.js (para a criação da API RESTful)
Banco de dados: PostgreSQL (para armazenamento de dados de pedidos, veículos, motoristas e status)
Deploy do back-end: Heroku ou Render (para deploy de aplicações Node.js com banco de dados PostgreSQL)

## 9) Plano de Dados (Dia 0) — somente itens 1–3

### 9.1 Entidades

Usuário — Representa as pessoas que utilizam o sistema (despachante, motorista, gerente).

Pedido de Transporte — Representa um pedido de transporte feito por um despachante.

Veículo — Representa os veículos disponíveis para transporte de carga.

Motorista — Representa os motoristas responsáveis pelos veículos e pedidos de transporte.

### 9.2 Campos por entidade


### Usuario
| Campo           | Tipo                          | Obrigatório | Exemplo            |
|-----------------|-------------------------------|-------------|--------------------|
| id              | número                        | sim         | 1                  |
| nome            | texto                         | sim         | "Ana Souza"        |
| email           | texto                         | sim (único) | "ana@exemplo.com"  |
| senha_hash      | texto                         | sim         | "$2a$10$..."       |
| papel           | número                        | sim         | 1                  |
| dataCriacao     | data/hora                     | sim         | 2025-08-20 14:30   |
| dataAtualizacao | data/hora                     | sim         | 2025-08-20 15:10   |

### Pedido de Transporte
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |
| Origem          | texto              | sim         | "Sao Paulo"             |
| Destino         | texto              | sim         | "Rio de Janeiro"        |
| tipoCarga       | texto              | sim         | "Eletronicos"           |
| dataEntrega     | data/hora          | sim         | 2025-08-20 14:35        |
| status          | texto              | sim         | "Em Andamento"          |
| veiculoId       | numero             | sim         | 1                       |
| motoristaId     | numero             | sim         | 1                       |
| dataCriacao     | data/hora          | sim         | 2025-08-20 14:30        |
| dataAtualizacao | data/hora          | sim         | 2025-08-20 15:10        |

### Veiculo
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |
| Placa           | texto              | sim         | "ABC-1234"              |
| Modelo          | texto              | sim         | "Volvo FH"              |
| Capacidade      | numero(ton)        | sim         | 20                      |
| status          | texto              | sim         | "Disponivel"            |
| dataCriacao     | data/hora          | sim         | 2025-08-20 14:30        |
| dataAtualizacao | data/hora          | sim         | 2025-08-20 15:10        |

### Motorista
| Campo           | Tipo               | Obrigatório | Exemplo            |
|-----------------|--------------------|-------------|--------------------|
| id              | número             | sim         | 1                  |
| nome            | texto              | sim         | "Carlos Pereira"   |
| cpf             | texto              | sim (único) | "123.456.789-00"   |
| veiculoId       | numero             | sim         | 11                 |
| dataCriacao     | data/hora          | sim         | 2025-08-20 14:30   |
| dataAtualizacao | data/hora          | sim         | 2025-08-20 15:10   |

### 9.3 Relações entre entidades
Um Usuário pode ter vários Pedidos de Transporte (1→N).

Um Pedido de Transporte pertence a um Usuário (N→1).

Um Pedido de Transporte é atribuído a um Motorista (1→1).

Um Pedido de Transporte é atribuído a um Veículo (1→1).

Um Veículo pode ser utilizado em vários Pedidos de Transporte (1→N).

Um Motorista pode estar associado a vários Pedidos de Transporte (1→N).