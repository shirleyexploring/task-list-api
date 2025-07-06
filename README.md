# Task List API

A simple GraphQL API for managing tasks, built with TypeScript, Prisma, Pothos, Apollo Server, and SQLite.

---

## 🛠️ Prerequisites

- **Node.js** v16 or higher  
- **npm** v8 or higher (or Yarn)  
- **SQLite** (no separate install needed—uses a local file)

---

## 🚀 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/shirleyexploring/task-list-api.git
   cd task-list-api
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up the database**  
   - Create a `.env` file in the project root with:  
     ```env
     DATABASE_URL="file:./dev.db"
     ```
   - Run Prisma migrations:  
     ```bash
     npm run prisma:generate
     npm run prisma:migrate
     ```
   - (Optional) Open Prisma Studio in your browser:  
     ```bash
     npx prisma studio
     ```

---

## 🏃‍♂️ Development

Start the server in watch mode (auto-restarts on file changes):

```bash
npm run dev
```

This runs `tsx watch src/index.ts` and will log:

```
> task-list-api@1.0.0 dev
> tsx watch src/index.ts

Task API running at http://localhost:4000/
```

---

## 📡 Using the Apollo Sandbox

Open your browser to:

```
http://localhost:4000/
```

This launches the **Apollo Sandbox**, where you can compose and execute GraphQL operations against your API.

---

## 🔍 Example Queries & Mutations

Below are sample operations you can paste into the Sandbox to test your API:

### 1. List Tasks

```graphql
query GetTasks($search: String) {
  tasks(search: $search) {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```
- **Variables** (optional):
  ```json
  { "search": "buy" }
  ```

### 2. Get a Single Task

```graphql
query GetTask($id: ID!) {
  task(id: $id) {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```
- **Variables**:
  ```json
  { "id": "your-task-id-here" }
  ```

### 3. Add a New Task

```graphql
mutation AddTask($title: String!) {
  addTask(title: $title) {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```
- **Variables**:
  ```json
  { "title": "Buy groceries" }
  ```

### 4. Toggle a Task’s Completed Status

```graphql
mutation ToggleTask($id: ID!) {
  toggleTask(id: $id) {
    id
    title
    completed
    updatedAt
  }
}
```
- **Variables**:
  ```json
  { "id": "your-task-id-here" }
  ```

### 5. Delete a Task

```graphql
mutation DeleteTask($id: ID!) {
  deleteTask(id: $id) {
    id
    title
  }
}
```
- **Variables**:
  ```json
  { "id": "your-task-id-here" }
  ```

### 6. Update a Task’s Title

```graphql
mutation UpdateTask($id: ID!, $title: String!) {
  updateTask(id: $id, title: $title) {
    id
    title
    updatedAt
  }
}
```
- **Variables**:
  ```json
  {
    "id": "your-task-id-here",
    "title": "Walk the dog in the park"
  }
  ```

### 7. Toggle All Tasks

```graphql
mutation ToggleAllTasks($completed: Boolean!) {
  toggleAllTasks(completed: $completed) {
    id
    title
    completed
  }
}
```
- **Variables**:
  ```json
  { "completed": true }
  ```

---

## 📦 Build & Production

1. **Compile**  
   ```bash
   npm run build
   ```

2. **Start**  
   ```bash
   npm start
   ```

Your compiled code will live in `dist/` and the server will still listen on port 4000 by default.

---

## 🚧 Bonus Points

### Complex Error Handling

Our current implementation handles basic "not found" and validation errors. For more advanced scenarios, consider:

- **Custom Error Classes**  
  Utilize Apollo's built-in `UserInputError` or create subclasses of `ApolloError` to represent distinct failure modes (e.g., `TaskNotFoundError`). Throw these from resolvers to attach consistent `code` and `message` fields.

- **GraphQL Unions for Error Results**  
  Define GraphQL unions like `type UpdateTaskResult = Task | TaskNotFoundError` to let clients branch on specific error types rather than catch-all exceptions.

- **Centralized Error Formatting**  
  Use Apollo Server's `formatError` hook or Pothos middleware to normalize all errors, sanitize stack traces, and include custom metadata (e.g., error codes, correlation IDs).

- **Input Validation Middleware**  
  Apply Zod schemas at the middleware layer to validate arguments before entering resolver logic, reducing repetitive `parse` calls in each resolver.

- **Prisma Error Handling**  
  Catch `Prisma.PrismaClientKnownRequestError` for database constraint violations (e.g., UUID parsing errors or unique constraint failures) and map them to user-friendly GraphQL errors.

- **Monitoring & Logging**  
  Integrate with a tool like Sentry to capture, aggregate, and alert on error occurrences. Include request context and user identifiers for faster debugging.

- **Retry & Circuit Breakers**  
  For transient failures (e.g., network blips), implement retry logic with exponential backoff in your data layer, possibly using frameworks like `p-retry`.

### Additional Operations

- **`updateTask(id: ID!, title: String!): Task | null`**  
  Updates only the `title` of an existing task. Returns the updated `Task` or `null` if the task doesn't exist.

- **`toggleAllTasks(completed: Boolean!): [Task!]!`**  
  Bulk-updates every task’s completed status, returning the full list of updated tasks.

---

## 🎉 Enjoy!

Feel free to extend this project further, add tests, or hook it up to a frontend client. Pull requests and feedback are welcome!
