# Development

## Architecture Diagrams

![virtual visits manually managed cloud architecture diagram](./vv-cloud-architecture.png "Virtual Visits Azure Cloud Architecture Diagram")

## Requirements:

- MSSQL
- Node LTS (Currently Node 12. There is a known issue with db-migrate and Node 14)
- GOV.UK Notify API keys
- Docker

_NOTE_ Use `nvm install` to automatically set node version.

## Environment Setup

### `.env`

In order to run this app locally you will need to create a `.env` file in the root of this project and add these variables to it.

```bash
# GOV.UK Notify API Key
GOVNOTIFY_API_KEY=
# MSSQL
MSQL_DB_DRIVER=
MSQL_DB_PORT=
MSQL_DB_POOL_MAX=
MSQL_DB_POOL_MIN=
MSQL_DB_POOL_IDLE_TIMEOUT=
# Local / Development DB
MSQL_DB_USER=
MSQL_DB_PASSWORD=
MSQL_DB_SERVER=
MSQL_DB_NAME=
# Test DB
MSQL_TEST_DB_USER=
MSQL_TEST_DB_PASSWORD=
MSQL_TEST_DB_SERVER=
MSQL_TEST_DB_NAME=
# External links
ORIGIN=
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
# GOV.UK Notify Email RESET PASSWORD Template ID
EMAIL_RESET_PASSWORD_TEMPLATE_ID=
# GOV.UK Notify Email MANAGER SIGN UP Template ID
EMAIL_SIGN_UP_TEMPLATE_ID=
# GOV.UK Notify Email AUTHORISE MANAGER ACCOUNT Template ID
EMAIL_SIGN_UP_REQUEST_TEMPLATE_ID=
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
# EMAIL DOMAINS ALLOWED
SIGN_UP_EMAIL_DOMAINS=
```

### MSSQL

#### Setup the database with docker

Set in your `.env` file the following properties.

```bash
MSQL_DB_DRIVER=mssql
MSQL_DB_PORT=1433
MSQL_DB_POOL_MAX=15
MSQL_DB_POOL_MIN=5
MSQL_DB_POOL_IDLE_TIMEOUT=30000
MSQL_DB_USER=sa
MSQL_DB_PASSWORD=P@55w0rd
MSQL_DB_SERVER=localhost
MSQL_DB_NAME=nhs_virtual_visit_dev
```

Run `./bin/setup_local_mssql_docker.sh`

Notes:
The script will create the database and populate with an admin user and organisation data.
Check docker memory allocation, port 1433 isn't used, wait time can be increased to check if the problem is mssql having no time to startup.

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

Note: A test database is required to run contract tests.

Run `./bin/setup_test_mssql_docker.sh` to set up and run the test database.

Notes:
The script will create the database and populate with an admin user and organisation data.
Check docker memory allocation, port 1433 isn't used, wait time can be increased to check if the problem is mssql having no time to startup.

## Running end to end (E2E) tests

To run E2E tests you need a test server running and test database populated.

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

## Applying database migrations

Database migrations are managed with [db-migrate](https://github.com/db-migrate/node-db-migrate). To create a new migration

```bash
npm run dbmigrate create:mssql description-for-your-migration
```

This will create an up and down migration as sql files in `db/migrations/mssql/sqls` as well as a javascript file in `db/migrations/mssql` to run the sql files.

Migrations are run with

```bash
npm run dbmigrate up:mssql
```

Migrations can be rolled back with

```bash
npm run dbmigrate down:mssql
```

You can do a dry-run to view the changes that will be applied without making any changes (for both up and down migrations)

```bash
npm run dbmigratedry up:mssql
```