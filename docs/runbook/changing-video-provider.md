# Changing video provider

We currently support the following video providers:

- [Whereby](https://whereby.com/)
- [Jitsi](https://jitsi.org/)

When a Trust is created in the app by a Site Admin, you are given the option of selecting a video provider.

We currently do not support changing a Trust's video provider via the Trust Admin dashboard after it has been created.

If you would like to change the video provider, you will need to do so by changing the Trust record in the database.

> Note: Whereby requires specific environment variables which you can find in the [development README](../development/README.md).

## Prerequisites

- Heroku CLI, see [setting up Heroku CLI](./setting-up-heroku-cli.md)

## Updating the video provider using Heroku CLI

1. [Establish a connection to the database](./accessing-heroku-app-database.md)
2. Find the `id` of the Trust you want to update:

```sql
SELECT * FROM trusts;
```

For the following command:

```sql
UPDATE trusts SET video_provider='jitsi' WHERE trusts.id=TRUST_ID;
```

3. Replace the `video_provider` column on the trust (either `'whereby'` or `'jitsi'`)
4. Replace `TRUST_ID` with the `id` retrieved in the previous query
5. Run the command

This should return `UPDATE 1` in the terminal.

6. Check that the changes were applied correctly:

```sql
SELECT * FROM trusts where trusts.id=TRUST_ID;
```

Finally, test your changes by scheduling and starting a visit in the app.
