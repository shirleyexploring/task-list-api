/**
 * Initializes and starts the Apollo Server with the generated schema.
 * The server listens on port 4000 by default and logs the URL once ready.
 */

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import builder from './builder';
import './schema/task';

const schema = builder.toSchema(); 
const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`Task API running at ${url}`);