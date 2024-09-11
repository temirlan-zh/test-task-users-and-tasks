## Description

Implementation of a test task for a job application.

Technologies used:

- NestJS
- TypeORM
- PostgreSQL
- Jest

ESLint/Prettier run pre-commit by _husky_ and _lint-staged_.

Implemented _filtering_, _sorting_ and _paging_ when querying users.

Centralized error handling is implemented using [an exception filter](src/common/filters/all-exceptions.filter.ts).

Centralized request logging is implemented using [a middleware](src/common/middlewares/logger.middleware.ts).

API documentation is implemented using _OpenAPI_.

Email and password regex checking is implemented via [a DTO](src/users/dto/create-user.dto.ts).

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
