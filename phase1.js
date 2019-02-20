let express = require('express');
let bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Query {
    user: User,
    users: [User!]!
  }

  type User {
    id: ID!,
    email: String!
  }
`;

let users = [
  {
    id: "1",
    email: "test.user@email.com",
  },
  {
    id: "2",
    email: "john.doe@email.com"
  }
];


const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      return users[0];
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});