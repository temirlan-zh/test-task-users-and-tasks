## Description

Implementation of a test task for a job application.

Technologies used:

- NestJS
- TypeORM
- PostgreSQL
- Jest

ESLint/Prettier run pre-commit by _husky_ and _lint-staged_.

Implemented _filtering_, _sorting_ and _paging_ for querying users.

Centralized error handling is implemented using [exception filters](https://docs.nestjs.com/exception-filters).

Centralized request logging is implemented using [middleware](https://docs.nestjs.com/middleware).

API documentation is implemented using [OpenAPI](https://docs.nestjs.com/openapi/introduction).

Email and password regex checking is implemented using _DTO_.

## Installation

```bash
$ pnpm install
```

## Running the app

You should configure PostgreSQL connection settings in `.env` file.

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Test

```bash
# unit tests
$ pnpm run test
```
