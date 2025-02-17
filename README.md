# Fastify Prisma TS-Rest Starter

Welcome to the **Fastify Prisma TS-Rest Starter**! This open-source TypeScript Node.js API starter is built to help you hit the ground running. Whether you're prototyping a new project or building production-ready APIs, this starter kit comes packed with everything you need.

## Features

- 📘 **[TypeScript](https://www.typescriptlang.org/docs)** 
  Benefit from type safety and modern JavaScript features right out of the box  


- ⚡ **[Fastify](https://fastify.dev)**  
  Fast and low-overhead HTTP server
  
- 🛢️ **[Prisma](https://www.prisma.io/docs)**  
  Work with your database using an intuitive and type-safe API  

-  🚀 **[TS-Rest](https://ts-rest.com/docs/quickstart)**  
    Build fully type-safe REST APIs effortlessly with ts-rest. Leveraging TypeScript’s type system, ts-rest lets you define endpoints and enforce type safety seamlessly between your server and client, ensuring robust and maintainable API designs

- 💉 **[Awilix (Dependency Injection](https://github.com/jeffijoe/awilix)**  
  Simple yet powerful dependency injection for a clean, testable architecture

- 🔒 **[Authentication](https://auth0.com/docs)**  
  Integrates with Auth0 and supports JWT-based authentication with customizable protected routes

- 📝 **[OpenAPI Documentation](https://swagger.io/specification)**  
  Easily generate and update API docs via integrated plugins—ideal for keeping your API documentation in sync with your code

- 🔍 **[Sentry Managed Tracing](https://docs.sentry.io/product)**  
  Leverage Sentry's powerful integration to capture exceptions and manage distributed tracing. This setup provides comprehensive insights into request flows and performance bottlenecks

- 📦 **Monorepo architecture**  
  Already with monorepo setups using [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turborepo.org/docs)

- 💅 **Modern linting an formatting**  
  Using [biome.js](https://biomejs.dev/guides/getting-started/).

- 🩺 **Built-in health check**  
  Including the database connectivity and extendable with custom checkers

- 📦 **Dockerized**  
  Optimized multi-stage [Dockerfile](./api/docker/Dockerfile) for production builds

- 🧪 **Testing**  
  Robust integration tests managed by [Vitest](https://vitest.dev/guide) and [TestContainers](https://node.testcontainers.org)


## Getting Started

### Prerequisites

- Node.js 22.x.x (current LTS version)
- pnpm 
- Docker with docker compose

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/fastify-prisma-ts-rest-starter.git
   cd fastify-prisma-ts-rest-starter
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:  
   Copy `./api/.env.example` to `./api/.env` and edit the values as needed.

   Do the same for `.api/.env.test` target

   ```bash
   cp ./api/.env.example ./api/.env
   cp ./api/.env.example ./api/.env.test
   ```

### Running the Project

#### Development

Start a local PostgreSQL database using Docker:

```bash
docker compose -p api-starter --env-file ./api/.env -f ./api/docker/docker-compose-dev.yml up -d
```

You can now apply migration and seeding

```bash
pnpm db:migrate
```

Then run the development server:

```bash
pnpm dev
```

#### Building and Running in Production

Build the project:

```bash
pnpm build
```

You can run the production build with:

```bash
pnpm start
```

## Final Notes

We hope you enjoy building with **Fastify Prisma TS-Rest Starter**. Happy coding and thank you for checking out this project!
