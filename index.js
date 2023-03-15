
const express = require('express')
const bodyParser = require('body-parser')

const { ApolloServer } = require('apollo-server-express');
const { resolvers, getUser } = require('./src/graphql/resolvers.ts');
const { typeDefs } = require('./src/graphql/schemas.ts');
const db = require('./src/modules/database');
const port = Number(process.env.PORT ?? 3000);

require('dotenv').config();

db.createTables();

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});




const server = new ApolloServer({
  typeDefs,
  resolvers,
  /*
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    return { user };
  }
  */
});

const startServer = async () => {
  await server.start();
  console.log('Server started!')
  server.applyMiddleware({ app,path : '/api/v1' });
}

startServer();

app.get('/', (req, res) => {
  res.send("Hello");
})