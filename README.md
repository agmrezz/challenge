# Logixs Challenge - Incident Management System

This is a full-stack incident management system built with modern web technologies. It allows users to track and manage incidents, assign them to users, and monitor their status.

## Tech Stack

- **Monorepo:** PNPM Workspaces & Turborepo
- **Frameworks:** Next.js (Web), NestJS (API)
- **Database:** PostgreSQL & Prisma
- **UI:** React, Tailwind CSS, shadcn/ui
- **Languages:** TypeScript
- **Containerization:** Docker & Docker Compose
- **Linting/Formatting:** Biome

## Project Structure

This repository is a monorepo managed by PNPM and Turborepo.

- `apps/api`: The NestJS backend application. It handles business logic, database interactions, and authentication.
- `apps/web`: The Next.js frontend application. It provides the user interface for interacting with the system.
- `packages/database`: Contains the Prisma schema, client, and migrations.
- `packages/ui`: A shared React component library based on shadcn/ui.
- `packages/typescript-config`: Shared TypeScript configurations for the workspace.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started) and Docker Compose

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/logixs-challenge.git
    cd logixs-challenge
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    The API service requires a `DATABASE_URL`. Prisma uses this to connect to the database. Create a `.env` file in the `apps/api` directory:

    `apps/api/.env`:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/logixsdb?schema=public"
    ```

    The `compose.yaml` file sets up the PostgreSQL container with these credentials by default.

### Running the Application

1.  **Start the database:**
    Use Docker Compose to start the PostgreSQL database container.

    ```bash
    docker-compose up -d postgres
    ```

2.  **Run database migrations:**
    Apply the Prisma schema to the database.

    ```bash
    pnpm --filter database prisma migrate dev
    ```

3.  **Run the development servers:**
    This command uses Turborepo to start the `api` and `web` applications in development mode.

    ```bash
    pnpm dev
    ```

    - Web application will be available at [http://localhost:3000](http://localhost:3000)
    - API will be available at [http://localhost:3001](http://localhost:3001)

## Environment Variables

- `DATABASE_URL`: The connection string for the PostgreSQL database. This is required by the `api` service.

  Example: `DATABASE_URL="postgresql://user:password@localhost:5432/logixsdb?schema=public"`
