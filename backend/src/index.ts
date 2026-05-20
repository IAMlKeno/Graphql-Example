import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5'
import cors from 'cors';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from "express";
import { readFile } from "node:fs/promises";
import { resolvers } from "./graphql/resolvers";
import { tracingMiddleware } from "middleware/tracing";
import { loggingPlugin } from "utils/logging";
import { pinoHttp } from 'pino-http';
import { logger } from "telemetry/logger";

const PORT = 4000;
const app = express();
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
  }),
  cors(),
  express.json(),
  tracingMiddleware
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const typeDefs = await readFile(join(__dirname, '../schema.gql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [loggingPlugin],
  introspection: true,
});
await server.start();
app.use('/graphql', apolloMiddleware(server, {
  context: async ({ req }) => ({ req }),
}));

if (!process.env.OO_ENDPOINT || !process.env.OO_AUTH) {
  console.warn('OpenObserve env vars missing — telemetry disabled');
}

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
});

/*,
Create a study guide to help prepare for a client interview. 
The tech stack is react, node.js, graphql and typescript. 

Here is my current knowledge base:
React - a frontend framework 
NodeJS
GraphQL - This is a Query language for APIs it allows users to request only the data fields they want. It uses of schemas to provide data structure. Additionally, it uses resolvers to provide code instructions to fetch data appropriately. Apollo server is a server that interacts with GraphQL to server data. Clients can use Apollo Client for state management in a frontend server.
TypeScript - this framework is built on Javascript, it introduces type-checking and other concepts such as interfaces.

The job description follows
*/
