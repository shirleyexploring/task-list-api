/**
 * Defines the GraphQL Task type, queries, and mutations.
 * Uses Prisma for data access and Zod for input validation.
 */

import builder, { prisma } from '../builder';
import { z } from 'zod';

// ---------- Validation Schemas ----------

// Ensure titles are non-empty strings 
const titleSchema = z.object({ title: z.string().min(1) });

// ---------- Task Object ----------
builder.prismaObject('Task', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    completed: t.exposeBoolean('completed'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

// Required root types for Pothos
builder.queryType({}); 
builder.mutationType({});

// ---------- Queries ----------

// List all tasks, optionally filtering by title
builder.queryField('tasks', (t) =>
  t.prismaField({
    type: ['Task'],
    args: { search: t.arg.string() }, // optional search string
    resolve: (query, _parent, { search }) =>
      prisma.task.findMany({
        ...query,
        where: search ? { title: { contains: search } } : {}, // filter if `search` provided
      }),
  }),
);

// Retrieve a single task by its ID
builder.queryField('task', (t) =>
  t.prismaField({
    type: 'Task',
    nullable: true, 
    args: { id: t.arg.id({ required: true }) },
    resolve: (query, _p, { id }) => prisma.task.findUnique({ ...query, where: { id } }),
  }),
);

// ---------- Mutations ----------

// Create a new task with a non-empty title
builder.mutationField('addTask', (t) =>
  t.prismaField({
    type: 'Task',
    args: { title: t.arg.string({ required: true }) },
    resolve: async (_query, _p, args) => {
      titleSchema.parse(args); // throw if title is empty
      return prisma.task.create({ data: { title: args.title } });
    },
  }),
);

// Flip the completed status of one task
builder.mutationField('toggleTask', (t) =>
  t.prismaField({
    type: 'Task',
    nullable: true, 
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_q, _p, { id }) => {
      const current = await prisma.task.findUnique({ where: { id } });
      if (!current) return null;

      return prisma.task.update({
        where: { id },
        data: {
          completed: { set: !current.completed },  // flip completed flag
          updatedAt: new Date(),
        },
      });
    },
  }),
);

// Remove a task by ID
builder.mutationField('deleteTask', (t) =>
  t.prismaField({
    type: 'Task',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_q, _p, { id }) =>
      prisma.task.delete({ where: { id } }).catch(() => null),
  }),
);

// ---------- Bonus Mutations ----------

// Update only the title of an existing task
builder.mutationField('updateTask', (t) =>
  t.prismaField({
    type: 'Task',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string({ required: true }),
    },
    resolve: async (_query, _parent, { id, title }) => {
      titleSchema.parse({ title }); // Validate non-empty title

      const existing = await prisma.task.findUnique({ where: { id } });
      if (!existing) return null; // Ensure the task exists

      // Update title and updatedAt
      return prisma.task.update({
        where: { id },
        data: {
          title,
          updatedAt: new Date(),
        },
      });
    },
  }),
);

// Bulk-set the completed status of all tasks
builder.mutationField('toggleAllTasks', (t) =>
  t.prismaField({
    type: ['Task'],
    args: {
      completed: t.arg.boolean({ required: true }),
    },
    resolve: async (query, _parent, { completed }) => {
      // Bulk‐update
      await prisma.task.updateMany({
        data: { completed },
      });

      // Return updated list
      return prisma.task.findMany({ ...query });
    },
  }),
);