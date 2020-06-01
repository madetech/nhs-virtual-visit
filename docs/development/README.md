# Development

Requirements:

- PostgreSQL 12
- Node LTS (Currently Node 12. There is a known issue with db-migrate and Node 14)
- GovNotify API keys

## Environment Setup

### `.env`

In order to run this app locally you will need to create a `.env` file in the root of this project and add these variables to it.

```bash
# GovNotify API Key
API_KEY=
# Postgres Connection String
DATABASE_URL=
# Postgres Connection String for the test database
TEST_DATABASE_URL=
# GovNotify SMS Initial Template ID
SMS_INITIAL_TEMPLATE_ID=
# GovNotify SMS Join Template ID
SMS_JOIN_TEMPLATE_ID=
# GovNotify Email Initial Template ID
EMAIL_INITIAL_TEMPLATE_ID=
# GovNotify Email Join Template ID
EMAIL_JOIN_TEMPLATE_ID=
# Valid Ward Codes
ALLOWED_CODES=
# Signing key for JWT tokens
JWT_SIGNING_KEY=
# Whereby Feature Flag
ENABLE_WHEREBY=
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

If you are installing a local instance of PostgreSQL on Ubuntu, see the steps in the separate [guide.](UBUNTU2004-PG12.md)

#### Enable SSL in Postgres

You may need to enable SSL on your local postgres server.

Within the data folder of your PostgreSQL installation (e.g. `~/Library/Application Support/Postgres/var-12` or `/usr/local/var/postgres`), generate an self-signed certificate (details here https://www.postgresql.org/docs/12/ssl-tcp.html#SSL-CERTIFICATE-CREATION).

After generating the certificate, edit the postgresql.conf file in the data folder to enable ssl (`ssl = on`).

Restart your PostgreSQL server and SSL will connections will be enabled

#### Setup the database

1. Create the database
   ```bash
   createdb nhs-virtual-visit-dev
   ```
2. Run all migrations
   ```bash
   npm run dbmigrate up
   ```
3. Add the database URL as an environment variable in `.env`. On Linux you may need to provide a username and password.
   ```bash
   cat <<<EOF >> .env
   DATABASE_URL=postgresql://localhost/nhs-virtual-visit-dev
   EOF
   ```

#### Seeding the database

To seed your database with data to get going quickly, you can run the file under `db/seeds.sql` by doing the following:

```bash
cat db/seeds.sql | psql nhs-virtual-visit-dev
```

This will create two wards with codes `TEST1` and `TEST2`

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

## Building a production version

```bash
npm run build
```

This will produce output that you can use to host a production copy of the app.

## Scheduling regular database cleanup

Old scheduled calls are deleted after 24 hours. You can cleanup the table by running the following in a scheduled job runner of your choosing (for Heroku we use https://devcenter.heroku.com/articles/scheduler)

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

To update the `db/schema.sql` file:

```bash
pg_dump -d nhs-virtual-visit-dev -s > db/schema.sql
```
