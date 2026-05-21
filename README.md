# GraphQL Example

## Description
This is an experimental project for practicing a modern full-stack GraphQL architecture. It aims to replicate a real production environment by running multiple services in a Docker Compose setup — a React frontend, an Express/GraphQL backend, a PostgreSQL database, a reverse proxy, and an observability platform.

## Project Structure

```
/
  ├─ backend/
  │  ├─ docker/
  │  ├─ prisma/              ← Prisma schema and migrations
  │  ├─ src/
  │  │  ├─ graphql/          ← resolvers and resolver tests
  │  │  ├─ middleware/        ← HTTP tracing middleware
  │  │  ├─ telemetry/         ← pino logger and OpenObserve client
  │  │  └─ utils/             ← Apollo Server logging plugin
  │  └─ schema.gql            ← GraphQL schema (source of truth)
  ├─ db/
  │  └─ scripts/             ← PostgreSQL init SQL
  ├─ frontend/
  │  └─ quote-resume/
  │     └─ app/
  │        ├─ components/    ← UI components and tests
  │        ├─ context/       ← React Context providers
  │        ├─ graphql/       ← queries, mutations, Apollo client
  │        └─ routes/        ← React Router page routes
  ├─ compose.yaml
  ├─ .gitignore
  └─ README.md
```

## Current State
A React frontend has been implemented with an Apollo Client. When the Docker Compose environment is running, you will be presented with two features: a Quote system and a Characters in Episode viewer.

The **Quote system** allows users to create an account and request quotes for different types of insurance (automotive, home, life). If a quote is not submitted, the system will recall unfinished quotes for the user the next time they log in.

The **Characters system** connects to the [Rick and Morty API](https://rickandmortyapi.com/). Users can enter an episode number and it will fetch the episode title and characters in the episode.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Running the project

```bash
docker compose up -d
```

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:3000 | React app (Vite dev server) |
| GraphQL API | http://localhost:4000/graphql | Apollo Server (direct access) |
| GraphQL via proxy | http://localhost/graphql | Traefik reverse proxy |
| Traefik dashboard | http://localhost:8080 | Proxy routing overview |
| OpenObserve UI | http://localhost:5080 | Log aggregation dashboard |

**OpenObserve credentials:** `admin@example.com` / `admin123` (set in `compose.yaml`)

### Environment variables
The backend reads environment variables at startup. When running outside Docker, use Node's built-in `--env-file` flag (Node 20.6+):

```bash
node --env-file .env dist/index.js
```

Key backend variables:

| Variable | Purpose | Example |
|---|---|---|
| `OO_ENDPOINT` | OpenObserve ingest URL | `http://openobserve:5080/api/default/default/_json` |
| `OO_AUTH` | Basic auth header value | `Basic <base64(email:password)>` |
| `LOG_LEVEL` | Minimum pino log level | `info` |
| `OO_MIN_LEVEL` | Minimum level sent to OpenObserve | `info` |

To generate the `OO_AUTH` value:
```bash
echo -n "admin@example.com:admin123" | base64
```
Then prefix the result with `Basic `.

## Technologies

| Technology | Role |
|---|---|
| **TypeScript** | Typed language for both frontend and backend |
| **React 19** | UI component library |
| **React Router v7** | Client-side routing and page structure |
| **Vite** | Frontend build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Apollo Client** | GraphQL client with caching and React hooks |
| **Express 5** | HTTP server for the backend |
| **Apollo Server 5** | GraphQL server layer on top of Express |
| **GraphQL** | Query language and schema definition |
| **Prisma 6** | Type-safe ORM for database access |
| **PostgreSQL 17** | Relational database |
| **Pino** | Structured JSON logger |
| **OpenObserve** | Log aggregation and observability UI |
| **Docker Compose** | Multi-service container orchestration |
| **Traefik** | Reverse proxy that routes `/graphql` to the backend |
| **Vitest** | Test runner for both frontend and backend |
| **React Testing Library** | Component testing utilities |

## Service Architecture

```
Browser
  │
  ├── :3000 ──► frontend (React/Vite)
  │               │
  │               └── Apollo Client ──► :80/graphql
  │
  ├── :80 ────► proxy (Traefik)
  │               │
  │               └── PathPrefix(/graphql) ──► backend:4000
  │
  ├── :4000 ──► backend (Express + Apollo Server)
  │               │
  │               ├── Prisma ORM ──► db:5432
  │               └── OpenObserve client ──► observability:5080
  │
  ├── :5432 ──► db (PostgreSQL)
  │
  └── :5080 ──► observability (OpenObserve)
```

Traefik is configured to watch Docker labels. The backend service declares a label that matches the `/graphql` path prefix, so all GraphQL traffic can flow through a single port 80 entry point without the frontend hardcoding the backend's port.

## Running Tests

```bash
# Backend (from /backend)
npx vitest

# Frontend (from /frontend/quote-resume)
npx vitest
```

### What is tested
- **Backend resolvers** (`src/graphql/resolvers.test.ts`) — PrismaClient and OpenObserve are mocked so tests run without a database or network. Each resolver's happy path and error path are covered.
- **Frontend components** (`app/components/__tests__/`) — Apollo's `useMutation`/`useQuery` hooks and React Context providers are mocked. Tests verify rendering, user interactions, and conditional display logic.

## Analysis

### GraphQL Concepts

#### Schema (`schema.gql`)
The schema is the contract between the client and server. It defines every type, query, and mutation the API exposes. Neither the frontend nor backend can exchange data in a shape that isn't declared here first.

#### Queries vs Mutations
- **Queries** are reads — they fetch data without side effects (e.g., `user(id: "1")`, `quotesByUser(ownerid: "1")`).
- **Mutations** are writes — they create, update, or delete data and return the modified record (e.g., `addUser(user: {...}): User!`).

#### Resolvers (`src/graphql/resolvers.ts`)
Each field in the schema maps to a resolver function. When a client sends a query, Apollo Server calls the matching resolver, which fetches data from Prisma and returns it in the shape the schema expects.

```
Client query: { user(id: "1") { fname email } }
        ↓
Apollo Server matches "user" to resolvers.Query.user()
        ↓
Resolver calls prisma.users.findUnique({ where: { id } })
        ↓
Response is shaped to match the User type in schema.gql
```

#### Apollo Client Link Chain (`app/graphql/client.ts`)
Apollo Client processes requests through a chain of "links" before they reach the server. Middleware links (like an auth or logging link) run first and can inspect or modify the request. The `HttpLink` is the terminating link that actually sends the HTTP request. Order matters — a link added after `HttpLink` will never run.

### State Management

State management in React allows us to keep track of, update, and share dynamic data. React creates a virtual DOM where elements and data can be updated or replaced based on state variables through the re-rendering of components.

There are different categories of state:

1. **Local State** — Data used by only one component (e.g., a text input value or a toggle). Managed with the `useState` hook.
2. **Global State** — Data shared across many unrelated parts of the app (e.g., the logged-in user, theme preferences). Handled by the Context API or libraries like Redux.
3. **Server State** — Data fetched from an API that needs to stay in sync with the client. Includes loading and error status. Apollo Client manages this for GraphQL queries.
4. **Derived State** — Values calculated on the fly from existing state rather than stored separately (e.g., a total price computed from a list of items).

#### React Context API vs Redux

This project uses **React Context API** for global state (the logged-in user, the selected app, and the current quote). Here is how Context compares to Redux:

| | Context API | Redux |
|---|---|---|
| **Setup** | Built into React, no extra packages | Requires `redux`, `react-redux`, often `redux-toolkit` |
| **Best for** | Low-frequency updates (auth, theme, locale) | High-frequency updates, complex state transitions |
| **Boilerplate** | Minimal — a `createContext` and a Provider component | More — actions, reducers, store, selectors |
| **DevTools** | Limited | Redux DevTools extension with time-travel debugging |
| **Performance** | Every consumer re-renders when context value changes | Subscribing components only re-render when their slice changes |

**Why Context was chosen here:** The app's global state (current user, selected app) changes infrequently — only on login, logout, or app selection. Context is sufficient and keeps the codebase simpler. Redux would be worth reaching for if state transitions became complex (e.g., many actions that modify the same slice) or if performance profiling showed unnecessary re-renders.

### Observability

The backend is instrumented at three levels:

#### 1. HTTP Tracing (`src/middleware/tracing.ts`)
Every inbound HTTP request is assigned a `traceId` (either from the `x-trace-id` request header, or a generated UUID). When the response finishes, a log entry is sent to OpenObserve with the method, path, status code, and `traceId`. The log level is derived from the status code: `info` for 2xx, `warn` for 4xx, `error` for 5xx.

#### 2. Apollo Server Plugin (`src/utils/logging.ts`)
An Apollo plugin hooks into the request lifecycle. `didResolveOperation` fires after the query is parsed and logs the operation name and variables. `didEncounterErrors` fires on GraphQL errors and logs the error messages — both carry the `traceId` from the Express request, so HTTP and GraphQL log entries can be correlated.

#### 3. Pino Structured Logging (`src/telemetry/logger.ts`)
Resolvers use a shared `pino` logger. Each resolver creates a **child logger** that carries context fields (e.g., `{ resolver: 'users' }`) into every log line it emits, without passing them manually:

```ts
const log = logger.child({ resolver: 'users', userId: id });
log.info('Fetching user');          // → { resolver: 'users', userId: '1', msg: 'Fetching user' }
log.error({ err: e }, 'Failed');    // → { resolver: 'users', userId: '1', err: {...}, msg: 'Failed' }
```

Pino outputs structured JSON, which OpenObserve can index and query. In development, a `pino-pretty` transport formats the output for the terminal. In all environments, an inline `Writable` stream sends logs to OpenObserve directly from the main thread.

**Why an inline stream instead of a transport file:** Pino transports run in worker threads. Worker threads do not inherit the `tsx` TypeScript loader from the main process, so they cannot resolve `.ts` imports. The solution is to keep the OpenObserve stream in the main thread as a plain Node.js `Writable`, where TypeScript imports resolve normally.

#### OpenObserve
Access the UI at [http://localhost:5080](http://localhost:5080) while the stack is running. The default stream is `default`. Log entries from all three instrumentation points above will appear there and can be filtered by `traceId`, `resolver`, `level`, or any other field in the JSON payload.
