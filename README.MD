# Circles

Developing a Social Groups web-app using typescript and graphQL

## Technology Used

### Frontend

- [**NextJs**](https://nextjs.org/docs/getting-started)
- [**Apollo Client**](https://www.apollographql.com/docs/react/)

### Backend

- [**Apollo-Express**](https://www.apollographql.com/blog/using-express-with-graphql-server-node-js/) as a Server
- [**Postgres**](https://www.postgresql.org/) as a Database
- [**TypeGraphQL**](https://typegraphql.com/) for setting GraphQL-API
- [**TypeORM**](https://typeorm.io/#/) as an ORM
- [**Redis**](https://redis.io/) for storing user session
- [**Firebase Storage**](https://firebase.google.com/products/storage) for storing and serving images

## Setup

### Database

1. Make sure you have Redis installed in your computer
1. Make sure you have Postgres installed in your computer if not install it from [here](https://www.postgresql.org/)
1. Open the Postgres shell(psql) and create a database
   ```shell
       create database circle;
   ```
1. Replace your database url in `.env` (check `.env.example` file for reference)

### Firebase Storage

1. Create a firebase project
1. Go to project settings -> service accounts -> generate new key (it will download a json file which has project keys)
1. save the json file as `src/firebase-admin-credentials.json`

### Frontend

1. cd into the client and install all dependencies
   ```shell
      cd client
      yarn
   ```
1. start dev server
   ```shell
       yarn dev
   ```

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
