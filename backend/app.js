const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const app = express();
const resolvers = require('./resolver/resolver');
const typeDefs = require('./schema/task');
const dotenv = require("dotenv");
const authenticate = require('./middlewares/authenticate');

dotenv.config()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        try {
            const operationName = req.body.operationName;
            console.log('Operation Name:', operationName);

            if (operationName === 'login' || operationName === 'register') {
                return {}
            }
            authenticate(req);

            return { user: req.user };
        } catch (error) {
            console.error('Authentication Error:', error.message); or
            throw new Error('Authentication failed: ' + error.message);
        }
    },
});

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        });
    }
}

startServer();

module.exports = app;