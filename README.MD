# Circles

Developing a Social Groups web-app using typescript and graphQL

## Technology Used

### Backend

- [**Apollo-Express**](https://www.apollographql.com/blog/using-express-with-graphql-server-node-js/) as a Server
- [**Postgres**](https://www.postgresql.org/) as a Database
- [**TypeGraphQL**](https://typegraphql.com/) for setting GraphQL-API
- [**TypeORM**](https://typeorm.io/#/) as an ORM
- [**Redis**](https://redis.io/) for storing user session

## Setup

### Database

1. Make sure you have Postgres installed in your computer if not install it from [here](https://www.postgresql.org/)
1. Open the Postgres shell(psql) and create a database
   ```shell
       create database circle;
   ```
1. Replace your database username and password in `./server/ormconfig.json`

### Backend

1. cd into the server and install all dependencies
   ```shell
      cd server
      npm install
   ```
1. open two terminals and run each of the below commands in seperate terminal

- ```shell
       npm run watch
  ```
- ```shell
       npm run dev
  ```
