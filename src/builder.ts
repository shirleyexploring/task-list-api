/**
 * Builds the GraphQL schema, integrating Prisma for database access.
 * Configures Pothos with the Prisma client and plugins.
 */

import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { PrismaClient } from '@prisma/client';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { DateTimeResolver } from 'graphql-scalars';

// Instantiate Prisma client for database access
export const prisma = new PrismaClient();

// Configure Pothos builder with Prisma plugin and custom scalar
const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: { client: prisma },
});

// Add DateTime scalar using graphql-scalars resolve
builder.addScalarType('DateTime', DateTimeResolver);

export default builder;
