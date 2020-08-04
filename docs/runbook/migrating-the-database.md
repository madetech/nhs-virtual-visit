# Migrating the database

To handle database migrations, the application uses a library called
[db-migrate](https://github.com/db-migrate/node-db-migrate). It tracks the
migrations that have been run by storing the names of the ones that have run in
a migrations table in the database. To view this in the database by running:

```sql
SELECT * FROM migrations;
```

Migrations are set up to run automatically on every deploy on Heroku as we’ve
defined in [our Procfile](https://github.com/madetech/nhs-virtual-visit/blob/master/Procfile)
to run the migration command. (The [Procfile](https://devcenter.heroku.com/articles/procfile)
is a Heroku configuration file that tells Heroku to run commands on app startup.)
It will only run ones that have not previously been run.

## Creating a new migration

To add a new table, change a table column, etc., create a new migration by using
the following command:

```bash
npm run dbmigrate create description-of-migration
```

1. Replace `description-of-migration` in the command with a hyphen separated name

We’ve named migrations based on what is being changed in the migration. For
example, for adding a `descriptor` column to the `trusts` table, the migration
name would be `add-descriptor-to-trusts`.

2. Run the command

This generates some boilerplate in `db/migrations` as well as the up and down
(or reverse) migration SQL files in `db/migrations/sql`.

3. Add the SQL statement for the up migration
4. Add the SQL statement for the down migration
5. Dry-run the migration to see what changes would be applied without actually
   making them by using:

```bash
npm run dbmigratedry up
```

6. Test the migrations by running up, down, then up again, and checking that the
   database schema is as you expect. The down migration should restore it
   exactly to its previous state before the migration.

To run the up migration:

```bash
npm run dbmigrate up
```

To run the down migration:

```bash
npm run dbmigrate down
```

## Considerations

### Blue/Green deployments

We use Preboot on the production apps to ensure zero downtime during deploys.
One of the caveats of this approach is during a release, there will be two
versions of the app running at the same time (overlapping for up to 3 minutes).
If a table or column is dropped during a migration, you may end up in a scenario
where the migration has run but requests are still being made from the old app
(referencing the table that has been dropped). Avoid this by splitting the
deploys in two:

1. First deploy removes or changes references to the table or column in question.
2. Second deploy actually drops the table or column. This way there is no chance
   of exceptions being raised due to stale references.

### Rolling back a release

When [rolling back a release](https://devcenter.heroku.com/articles/releases#rollback) that contains
a migration, remember to run the down migration by ensuring you have
[Heroku CLI set up](https://github.com/madetech/nhs-virtual-visit/blob/master/docs/runbook/setting-up-heroku-cli.md),
then:

1. Run bash on the Heroku app by replacing `HEROKU_APP` and using:

```bash
heroku run bash -a HEROKU_APP
```

2. Dry-run the down migration and check that it’s what you’re expecting

```bash
npm run dbmigratedry down -- -e production
```

3. Assuming everything is as expected, run the down migration command:

```bash
npm run dbmigrate down -- -e production
```

4. Quit bash by typing exit

You can double check the most recent migration has been reverted by
[establishing a connection to the database](https://github.com/madetech/nhs-virtual-visit/blob/master/docs/runbook/accessing-heroku-app-database.md).
For example, if the most recent migration added a column to a table, then check
that column no longer exists by describing the table schema using:

```sql
\d TABLE_NAME
```
