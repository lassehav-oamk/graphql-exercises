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
    email: String!,
    name: Name!,
    addressStreet: String!,
    addressPostNumber: String!,
    addressCity: String!,
    addressCountry: String!,
    firstName: String!,
    familyName: String!,
    birthday: String,
  }
`;

let users = [
  {
    id: "1",
    email: "test.user@email.com",
    firstName: "Test",
    familyName: "User",
    addressStreet: "Codestreet 789",
    addressPostNumber: "110101",
    addressCity: "Oulu",
    addressCountry: "CD",
    birthday: "2000-12-24",
  },
  {
    id: "2",
    email: "john.doe@email.com",
    firstName: "John",
    familyName: "Doe",
    addressStreet: "Highway 76",
    addressPostNumber: "0001000",
    addressCity: "New York",
    addressCountry: "US",
    birthday: "2001-12-24",
  }
];


const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      return users[0];
    },
    users: (parents, args, context, info) => {
      return users;
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