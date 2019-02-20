let express = require('express');
let bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Mutation {    
    createUser(
      email: String!,
      name: iName!,
      addressStreet: String!,
      addressCity: String!,
      addressCountry: String!,
      addressPostNumber: String!       
      ): NewUserResponse!
  }

  type NewUserResponse {
    success: Boolean!    
  }

  type Query {
    user(id: ID!): User,
    users: [User!]!,
    invoice(id: ID!): Invoice!
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

  input iName {
    firstName: String!,
    familyName: String!
  }

  type Address {
      street: String!,
      city: String!,
      postalCode: Int
      country: String!
  }

  type Invoice {
    id: ID!,
    createdDate: String!,
    paymentDate: String,
    customer: User!
    description: String!
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
    alias: "testmule"
  },
  {
    id: "2",
    email: "clark.kent@superman.com",
    firstName: "Clark",
    familyName: "Kent",
    addressStreet: "Kryptonite Rd 1",
    addressPostNumber: "0000001",
    addressCity: "Smallville",
    addressCountry: "US",
    birthday: "2000-12-23",
    alias: "superman"
  }
];

let invoices = [
  {
    id: "1",
    createdDate: "2019-02-20",
    paymentDate: null,
    customer: "2",
    description: "Barrel of bananas"
  },
  {
    id: "2",
    createdDate: "2019-02-19",
    paymentDate: null,
    customer: "1",
    description: "Barrel of fish"
  },
];


const resolvers = {
  Query: {
    user: (parent, args, context, info) => {      
      return users.find(u => u.id === args.id);
    },
    users: (parents, args, context, info) => {
      return users;
    },
    invoice: (parents, args, context, info) => {
      const invoice = invoices.find(i => i.id == args.id);
      return invoice; 
    }
  },

  Mutation: {
    createUser: (parent, args, context, info) => { 
      console.log("tut");
      let newUser = {
        id: ((users.length)+1).toString(),
        email: args.email,
        firstName: args.name.firstName,
        familyName: args.name.familyName,
        addressStreet: args.addressStreet,
        addressPostNumber: args.addressPostNumber,
        addressCity: args.addressCity,
        addressCountry: args.addressCountry,
        birthday: null,
        alias: null
      }
      users.push(newUser);
      return { success: true}
    }
  },

  User: {
    name: (parent, args, context, info) =>
    {
      return {
        firstName: parent.firstName,
        familyName: parent.familyName
      }
    },
    address: (parent, args, context, info) => {
      return {
        street: parent.addressStreet,
        postalCode: parent.addressPostNumber,
        city: parent.addressCity,
        country: parent.addressCountry
      }
    },
  },

  Invoice: {
    customer: (parent, args, context, info) => {
      const user = users.find(u => u.id == parent.customer);
      return user;
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