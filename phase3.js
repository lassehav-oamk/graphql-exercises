let express = require('express');
let bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Query {
    user: User
  }

  type User {
    id: ID!,
    email: String!,
    name: Name!,
    address: Address!,
    birthday: String,
    alias: String #nickname
  }

  type Name {
      firstName: String!,
      familyName: String!
  }

  type Address {
      street: String!,
      city: String!,
      postalCode: Int
      country: String!
  }
`;

let users = [
  {
    id: 1,
    email: "test.user@email.com",
    firstName: "Test",
    familyName: "User",
    streetAddress: "Codestreet 789",
    postalCode: 110101,
    country: "CD",
    birthday: "2000-12-24",
    alias: "testmule"
  }
];


const resolvers = {
  Query: {
    user: () => {
      return users[0];
    }
  },

  User: {
    name: (parent, args, context, info) =>
    {
      return {
        firstName: parent.firstName,
        familyName: parent.familyName
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});