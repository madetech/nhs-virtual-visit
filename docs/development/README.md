# Development

## Architecture Diagrams

Manually setup:

![virtual visits manually managed cloud architecture diagram](./vv-cloud-architecture.png "Virtual Visits Azure Cloud Architecture Diagram")

Terraform:

![virtual visits terraform managed cloud architecture diagram](./azure_userEvents.png)

## Requirements:

- PostgreSQL 12 / MSSQL
- Node LTS (Currently Node 12. There is a known issue with db-migrate and Node 14)
- GOV.UK Notify API keys
- Docker

_NOTE_ Use `nvm install` to automatically set node version.

## Environment Setup

### `.env`

In order to run this app locally you will need to create a `.env` file in the root of this project and add these variables to it.

```bash
# GOV.UK Notify API Key
API_KEY=
# Postgres Connection String
PG_DB_URL=
# Postgres Connection String for the test database
PG_TEST_DB_URL=
# MSSQL
MSQL_DB_DRIVER=
MSQL_DB_PORT=
MSQL_DB_POOL_MAX=
MSQL_DB_POOL_MIN=
MSQL_DB_POOL_IDLE_TIMEOUT=
MSQL_DB_USER=
MSQL_DB_PASSWORD=
MSQL_DB_SERVER=
MSQL_DB_NAME=
# MSSQL Test
MSQL_TEST_DB_USER=
MSQL_TEST_DB_PASSWORD=
MSQL_TEST_DB_SERVER=
MSQL_TEST_DB_NAME=
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

### PostgreSQL 12

#### Setup the database with docker

Set `PG_DB_URL=postgresql://postgres:postgres@localhost/nhs-virtual-visit-dev` and `PG_TEST_DB_URL=postgresql://postgres:postgres@localhost/nhs-virtual-visit-dev` in your `.env` file.

Run `./bin/setup_dev_db_docker.sh`

If prompted for a password, enter 'postgres'

Notes:

- If you omit the `--no-start` flag it'll start the container in an interactive shell, which will kill the container when you exit.
- You may stop the container with `docker-compose stop postgres`.
- You may start the container again with `docker-compose start postgres`.
- You may destroy the container with `docker-compose down`.

#### Setup the database installed locally

If you are installing a local instance of PostgreSQL on Ubuntu, see the steps in the separate [guide.](./UBUNTU2004-PG12.md)

1. Add the database URL as an environment variable in `.env`. On Linux you may need to provide a username and password.
   ```bash
   cat <<<EOF >> .env
   PG_DB_URL=postgresql://localhost/nhs-virtual-visit-dev
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

Note: A test database is required to run contract tests. You can quickly set one up using `bin/setup_test_db.sh` or `bin/setup_test_db_docker.sh` depending on your database setup.

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

## Terraform managed cloud architecture

Terraform managed cloud architecture currently only refers to things under `userEvents/az`, there you will find the script `./setup.sh` which when executed will look for existing Terraform state in Azure, if it is not found it will create it otherwise it will establish a connection to it.

After this is done you can use Terraform as usual.  
Code pertaining to function apps in the setup is stored under `./nhs_virtual_visit_terraform/`, each individual function is stored in its own folder. Running `make` will build these functions as zips in the folder `./build`.

Terraform will recreate functions as needed when changes are detected in the files under `./build` by comparing the SHA256 hash of the local zip and the one that is currently stored in the Azure storage account as it is added on to the name at the end and Terraform recreates function resources when their names are changed.

## Manually managed cloud architecture

Manually managed cloud architecture currently refers to the infrastructure that is used to deploy docker images built using GitHub actions when CI passes.

This is workflow is currently hard coded to only run on Made Tech's repository and requires that all required environment variables are set as GitHub secrets as well as `AZURE_CREDENTIALS`, `ACR_SERVER`, `ACR_USERNAME` and `ACR_PASSWORD` where 'ACR' refers to an Azure Cloud Registry instance.
