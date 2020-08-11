# Setting up Sentry

To track errors and get full stack traces of exceptions, we use [Sentry](https://sentry.io). This makes it easier to diagnose bugs found in the application.

## Creating a Sentry organisation and project

The application is already set up to catch exceptions and report to Sentry using
their SDK, see [\_error.js](../../../src/pages/../../nhs-virtual-visit/pages/_error.js).
As a result, the only thing that needs to be done is setting the required Sentry
environment variables (or config vars) on your Heroku apps.

1. [Create a Sentry organisation](https://sentry.io/signup/) (if your trust
   doesn't have one already)
1. Within the **Projects** section of your organistation, click on **Create Project**
1. Choose **React** for the platform
1. Set your default alert settings, we recommend **Alert me on every new issue**
1. Enter a name for the project
1. Click on **Create Project**

## Adding the Sentry environment variables

The following environment variables are needed from Sentry project:

```
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

For each one of these, you'll need to add them to each Heroku app. To add an
environment variable to a Heroku app, see their documentation on [config vars](https://devcenter.heroku.com/articles/config-vars).

The environment variable: `ENABLE_SENTRY=yes` is also needed to toggle on the
usage of Sentry in the application.

### Finding the Sentry environment variables

#### `SENTRY_ORG`

1. Click on **Settings** within your organisation

Then under **Organisation Settings** and **General**, you'll see **Name** which
is the unique ID used to identify your organization.

#### `SENTRY_PROJECT`

1. Click on **Settings** within your organisation
1. Under the **Organisation** section, click on **Projects**
1. Click on your newly created project

Then under **Project Settings** and **Project Details**, you'll see **Name**
which is the unique ID used to identify your project.

#### `SENTRY_DSN`

1. Click on **Settings** within your organisation
1. Under the **Organisation** section, click on **Projects**
1. Click on your newly created project
1. Under the **SDK Setup** section, click on **Client Keys (DSN)**

Then under **Client Keys** and **Default**, you'll see **DSN**
which is used to tell the SDK to send events to your project.

#### `SENTRY_AUTH_TOKEN`

This is used for source map uploads by using an [internal integration](https://docs.sentry.io/product/integrations/integration-platform/#internal-integrations) in Sentry called Automatic Sourcemap Upload. To add this integration and value needed for `SENTRY_AUTH_TOKEN`:

1. Click on **Settings** within your organisation
1. Under the **Organisation** section, click on **Integrations**
1. Click on **Add Installation**

Once installed, you'll be able to click on the integration and under **Tokens**,
create a new token to use for `SENTRY_AUTH_TOKEN`.
