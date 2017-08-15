const { makeExecutableSchema } = require ('graphql-tools');
const resolvers = require('./resolvers');

// Type definitions in the Schema Definition Language
const typeDefs = `
    type Link {
        id: ID!
        url: String!
        description: String!
        author: User
    }

    type User {
        id: ID!
        name: String!
        email: String
    }

    input AuthProviderSignupData {
        email: AUTH_PROVIDER_EMAIL
    }

    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }

    type Query {
        allLinks: [Link!]!
        allUsers: [User!]!
    }

    type Mutation {
        createLink(url: String!, description: String!): Link
        createUser(name: String!, authProvider: AuthProviderSignupData!): User
        createVote(linkId: ID!): Vote
        signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    }

    type SigninPayload {
        token: String
        user: User
    }

    type Vote {
        id: ID!
        link: Link!
        user: User!
    }
`;

// We are exporting the GraphQLSchema object that is to be used by our server
module.exports = makeExecutableSchema({ typeDefs, resolvers});
