# Changing video provider

We currently support the following video providers:

- [Whereby](https://whereby.com/)
- [Jitsi](https://jitsi.org/)

When a Trust is created in the app by a Site Admin, you are given the option of selecting a video provider.

We currently do not support changing a Trust's video provider via the Trust Admin dashboard after it has been created.

If you would like to change the video provider, you will need to do so by changing the Trust record in the database.

Whereby requires specific environment variables which you can find in the [development README](../development/README.md).

## Prerequisites

- Heroku CLI, see [setting up Heroku CLI](./setting-up-heroku-cli.md)

## How to update

Once that is installed, establish a connection to your database (https://devcenter.heroku.com/articles/heroku-postgresql#pg-psql), replacing HEROKU_APP_NAME with the app name you are connecting to (this can be found in your heroku dashboard).

```
heroku pg:psql -a HEROKU_APP_NAME
```

Find the ID of the Trust you want to update.

```
SELECT * FROM trusts;
```

Update the video_provider column on the trust (either 'whereby' or 'jitsi'). Replace TRUST_ID with the ID retrieved in the previous query.

```
UPDATE trusts SET video_provider='jitsi' WHERE trusts.id=TRUST_ID;
```

Check that the changes were applied correctly

```
SELECT * FROM trusts where trusts.id=TRUST_ID;
```

And finally test your changes by scheduling and starting a visit in the app.
