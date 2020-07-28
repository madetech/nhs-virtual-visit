# Accessing the database of a Heroku app

## Prerequisites

- Heroku CLI, see [setting up Heroku CLI](./setting-up-heroku-cli.md)

## Connecting to a database

1. Find the name of the Heroku app you want to connect to in your pipeline
1. Establish a connection to the database of the app by using the following
   command and replacing `HEROKU_APP_NAME`:

```bash
heroku pg:psql -a HEROKU_APP_NAME
# --> Connecting to postgresql-foobar-12345
# psql (12.2, server 12.3 (Ubuntu 12.3-1.pgdg16.04+1))
# SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
# Type "help" for help.

# nhs-virtual-visit-staging::DATABASE=>
```

This provides you with a [PostgreSQL Interactive Terminal](https://www.postgresql.org/docs/current/app-psql.html) which allows you to execute queries and commands.

For more information, see the documentation on [Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql).
