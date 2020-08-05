# Runbook

NHS Book a virtual visit is a web application that connects patients to their
loved ones via video call. It's built using [Next.js](https://nextjs.org/) with
a [PostgreSQL](https://www.postgresql.org) database.

Current NHS trusts using the service have been set up with a fork of this
repository to enable their own feature development and the ability to receive
updates from Made Tech. This consists of the following dependencies:

- [Heroku](https://www.heroku.com) - to build and host the application
- [CircleCI](https://circleci.com/) - to run automated tests on a pull request
- [GOV.UK Notify](https://www.notifications.service.gov.uk) - to send text
  messages and emails
- [Jitsi Meet](https://github.com/jitsi/jitsi-meet/blob/master/doc/README.md) - to enable video calls (open source solution)
- [Whereby](https://whereby.com/information/product-api/) - to enable video
  calls (paid solution)
- [Sentry](https://sentry.io) - to log and monitor uncaught errors and
  exceptions

The purpose of this runbook is to provide documentation for setting up the
application as described above. That being said, it's entirely possible to
replace these services with ones that work best for your trust.

To set up the application like current NHS trusts:

1. [Setting up your repository](./setting-up-your-repo.md)
1. [GOV.UK Notify Templates](./govuk-notify-templates.md)
1. [Setting up CircleCI](./setting-up-circle-ci.md)
1. [Deploying to Heroku](./deploying-to-heroku.md)

For maintenance and other miscellaneous tasks:

- [Setting up Heroku CLI](./setting-up-heroku-cli.md)
- [Accessing the database of a Heroku app](./accessing-heroku-app-database.md)
- [Migrating the database](./migrating-the-database.md)
- [Changing video provider](./changing-video-provider.md)
