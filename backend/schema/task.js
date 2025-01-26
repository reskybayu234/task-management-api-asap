const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    dueDate: String
    status: String!
  }

  type User {
    id: ID!
    username: String!
    token: String
  }

  input RegisterInput {
    username: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Query {
    getTask(filterByStatus: String, filterByDueDate: String): [Task]
    getTaskDetail(id: ID!): Task
  }

  input TaskInput {
    title: String!
    description: String
    dueDate: String
    status: String!
  }

  type Mutation {
    createTask(task: TaskInput!): Task
    updateTask(id: ID!, task: TaskInput!): Task
    deleteTask(id: ID!): Task
    register(user: RegisterInput!): User
    login(user: LoginInput!): User
  }
`;

module.exports = typeDefs;  