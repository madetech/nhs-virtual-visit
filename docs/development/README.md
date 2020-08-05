# Development

Requirements:

- PostgreSQL 12
- Node LTS (Currently Node 12. There is a known issue with db-migrate and Node 14)
- GOV.UK Notify API keys

_NOTE_ Use `nvm install` to automatically set node version.

## Environment Setup

### `.env`

In order to run this app locally you will need to create a `.env` file in the root of this project and add these variables to it.

```bash
# GOV.UK Notify API Key
API_KEY=
# Postgres Connection String
DATABASE_URL=
# Postgres Connection String for the test database
TEST_DATABASE_URL=
# GOV.UK Notify SMS Initial Template ID
SMS_INITIAL_TEMPLATE_ID=
# GOV.UK Notify SMS Updated Visit Template ID
SMS_UPDATED_VISIT_TEMPLATE_ID=
# GOV.UK Notify SMS Join Template ID
SMS_JOIN_TEMPLATE_ID=
# GOV.UK Notify Email Initial Template ID
EMAIL_INITIAL_TEMPLATE_ID=
# GOV.UK Notify Email Updated Visit Template ID
EMAIL_UPDATED_VISIT_TEMPLATE_ID=
# GOV.UK Notify Email Join Template ID
EMAIL_JOIN_TEMPLATE_ID=
# Signing key for JWT tokens
JWT_SIGNING_KEY=
# Whereby API Credentials
WHEREBY_API_KEY=
WHEREBY_SUBDOMAIN=
# Sentry credentials
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
ENABLE_SENTRY=
```

### PostgreSQL 12

#### Setup the database with docker

Run `docker-compose up -d` to create the container.

Set `DATABASE_URL=postgresql://postgres:postgres@localhost/nhs-virtual-visit-dev` in your `.env` file.

Run `./bin/setup_dev_db_docker.sh`

Notes:

- You may have to run this as root (using `sudo`) under Linux.
- If you omit the `--no-start` flag it'll start the container in an interactive shell, which will kill the container when you exit.
- You may stop the container with `docker-compose stop`.
- You may start the container again with `docker-compose start`.
- You may destroy the container with `docker-compose down`.

#### Setup the database installed locally

If you are installing a local instance of PostgreSQL on Ubuntu, see the steps in the separate [guide.](./UBUNTU2004-PG12.md)

1. Add the database URL as an environment variable in `.env`. On Linux you may need to provide a username and password.
   ```bash
   cat <<<EOF >> .env
   DATABASE_URL=postgresql://localhost/nhs-virtual-visit-dev
   EOF
   ```
1. Run the database setup script

   ```bash
   ./bin/setup_dev_db.sh
   ```

   - This will setup the database with two wards with codes `TEST1` and `TEST2`

## Running the service locally

You can run a local copy of the app by running

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running tests

You can run tests by running

```bash
npm run test
```

Contract tests can be run with

```bash
npm run test:contract
```

Note: A test database is required to run contract tests. You can quickly set one up using `bin/setup_test_db.sh`

## Running end to end (E2E) tests

To run E2E tests you need a test server running

```bash
npm run test:server
```

E2E tests (powered by [Cypress](https://www.cypress.io/)) can be run headless with

```bash
npm run test:e2e
```

or using the [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html#Overview) to watch the test run

```bash
npm run test:e2e:open
```

## Building a production version

```bash
npm run build
```

This will produce output that you can use to host a production copy of the app.

## Scheduling regular database cleanup

Old scheduled calls have all personal data removed after 24 hours. You can cleanup the table by running the following in a scheduled job runner of your choosing (for Heroku we use https://devcenter.heroku.com/articles/scheduler)

```bash
npm run cleandb
```

## Applying database migrations

Database migrations are managed with [db-migrate](https://github.com/db-migrate/node-db-migrate). To create a new migration

```bash
npm run dbmigrate create description-for-your-migration
```

This will create an up and down migration as sql files in `db/migrations/sqls` as well as a javascript file in `db/migrations` to run the sql files.

Migrations are run with

```bash
npm run dbmigrate up
```

Migrations can be rolled back with

```bash
npm run dbmigrate down
```

You can do a dry-run to view the changes that will be applied without making any changes (for both up and down migrations)

```bash
npm run dbmigratedry up
```
