import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5'
import cors from 'cors';
import express from "express";
import { readFile } from "node:fs/promises";
import { resolvers } from "./graphql/resolvers";

const PORT = 4000;
const app = express();
app.use(cors(), express.json()/*, authMiddleware*/);


const typeDefs = await readFile('./schema.gql', 'utf8');

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
app.use('/graphql', apolloMiddleware(server));
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
