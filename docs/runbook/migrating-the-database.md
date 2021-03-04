# Migrating the database

To handle database migrations, the application uses a library called
[db-migrate](https://github.com/db-migrate/node-db-migrate). It tracks the
migrations that have been run by storing the names of the ones that have run in
a migrations table in the database. To view this in the database by running:

```sql
SELECT * FROM migrations;
```

Migrations are set up to run automatically on every deploy on Azure.

## Creating a new migration

To add a new table, change a table column, etc., create a new migration by using
the following command:

```bash
npm run dbmigrate create:mssql description-of-migration
```

1. Replace `description-of-migration` in the command with a hyphen separated name

We’ve named migrations based on what is being changed in the migration. For
example, for adding a `descriptor` column to the `trusts` table, the migration
name would be `add-descriptor-to-trusts`.

2. Run the command

This generates some boilerplate in `db/migrations/mssql` as well as the up and down
(or reverse) migration SQL files in `db/migrations/mssql/sqls`.

3. Add the SQL statement for the up migration
4. Add the SQL statement for the down migration
5. Dry-run the migration to see what changes would be applied without actually
   making them by using:

```bash
npm run dbmigratedry up:mssql
```

6. Test the migrations by running up, down, then up again, and checking that the
   database schema is as you expect. The down migration should restore it
   exactly to its previous state before the migration.

To run the up migration:

```bash
npm run dbmigrate up:mssql
```

To run the down migration:

```bash
npm run dbmigrate down:mssql
```