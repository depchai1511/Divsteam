const {gql} = require('apollo-server-express');


const typeDefs = gql`
  type User {
    user_id : ID
    full_name: String
    email: String
    username: String
    password: String

  }

  type Suggestion {
    id: ID!
    user_id: ID!
    course_id: ID!
  }

  type Tag {
    id: ID!
    title: String!
  }

  type Course {
    id: ID!
    user_id: ID!
    title: String!
    description: String!
  }

  type Query {
    user(id: ID!): User
    users : [User]
    course(id: ID!): Course
  }

  type Mutation {
    signUp(full_name: String!, email: String!, password: String!, username: String!): String!
    signIn(username : String!, password : String!) : String!
    createSuggestion(user_id: ID!, course_id: ID!): Suggestion!
    createTag(title: String!): Tag!
    createCourse(user_id: ID!, title: String!, description: String!): Course!
  }
`;

module.exports = {typeDefs};