# Monquelize

Um aplicativo web para comparar desempenho, manutenção e UX entre bancos de dados SQL (PostgreSQL - Sequelize) e NoSQL (MongoDB - Mongoose)

## Projeto

O projeto consiste na construçãao do módulo de vendas e controle de estoque de um sistema ERP. Consiste em cadastro de produtos, categorias, unidades de medidas, usuários, vendas, compras e estoque de produtos.
O objetivo é observar as diferenças práticas e teóricas de uma mesma base de dados modelada em SQL e NoSQL, e o impacto dos ORMs/ODMs nas consultas e produtividade de entrega de código
As tecnologias utilizadas para realização do estudo foram:

- Angular 9.x
- Node 14.x & Express.js
- MongoDB 4.x & Mongoose
- PostgreSQL & Sequelize.js

### Interface

![app](./docs/img/app.png 'App')

## Instalação

O ambiente local deve estar configurado com instalação do Node.js, Angular, MongoDB e PostgreSQL

1. `npm install` para instalar as dependências
2. `npm run scenario-small` para popular os PostgreSQL e MongoDB. Os databases serão criados com os nomes `postgres-sequelize` (PostgreSQL) e `mongodb-mongoose` (MongoDB)
3. `npm run dev` para executar o server e o client em ambiente de desenvolvimento
4. Abrir o navegador em http://localhost:4200

## Arquitetura

O projeto utiliza uma arquitetura em camadas, no qual as requisições partem de um único ponto da interface e são disparadas simultaneamente para dois servidores web Node.js, um conectado ao PostgreSQL e outro ao MongoDB.

![app](./docs/img/architecture.png 'Architecture')

## Modelagem

### PostgreSQL

A modelagem em PostgreSQL adotou o modelo relacional clássico.

![app](./docs/img/sql-model.png 'Postgre')

### MongoDB

A modelagem em MongoDB foi focada na performance da parte de venda de produtos, que de acordo com a finalidade do sistema, será a funcionalidade mais utilizada pelos consumidores da aplicação. Duplicidade de documentos tambem foram utilizadas para melhora na performance de consultas.

![app](./docs/img/nosql-model.png 'MongoDB')

## Principais resultados

As consultas foram ranqueadas por nível de importância:

1. Consulta de produtos por categoria, para realização de vendas na frente de caixa
1. Consulta de vendas por mês
1. Consulta de produtos, utilizando paginação server-side
1. Inserção de novas vendas
1. Edição de produtos
1. Remoção de produto
1. Relatório de vendas por mês, retornando somatório do total vendido e quantidade de vendas
1. Relatório de vendas por mês distribuı́das por categorias de produtos, retornando total vendido e quantidade de vendas por categoria

Tempos de execução para realização das consultas (Média de tempo de 10 requisições de cada consulta)

| Consulta | Sequelize & PostgreSQL - Tempo de consulta (ms) | Mongoose & MongoDB - Tempo de consulta (ms) | Mais performático | Percentual relativo ao maior tempo |
| -------- | ----------------------------------------------- | ------------------------------------------- | ----------------- | ---------------------------------- |
| #1       | 119,14                                          | 17,00                                       | MongoDB           | 14,26%                             |
| #2       | 54,69                                           | 852,34                                      | PostgreSQL        | 6,42%                              |
| #3       | 59,52                                           | 18,37                                       | MongoDB           | 30,86%                             |
| #4       | 77,60                                           | 66,01                                       | MongoDB           | 85,06%                             |
| #5       | 33,85                                           | 181,04                                      | PostgreSQL        | 18,70%                             |
| #6       | 1,51                                            | 719,79                                      | PostgreSQL        | 0,21%                              |
| #7       | 64,70                                           | 54,69                                       | MongoDB           | 84,53%                             |
| #8       | 62,84                                           | 57,32                                       | MongoDB           | 91,22%                             |

![app](./docs/img/results.png 'Results')

> **_NOTE:_** O projeto é fruto de um Trabalho de Conclusão de Curso em Engenharia de Computação do CEFET-MG. Todo o estudo e resultados detalhados podem ser visualizados na pasta `/docs` do repositório

## Autor

- Pedro Matias
