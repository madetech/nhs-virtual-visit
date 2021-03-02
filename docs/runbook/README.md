# Runbook

## Overview

NHS Book a virtual visit is a web application that connects patients to their
loved ones via video call. It's built using [Next.js](https://nextjs.org/) with
a [Azure SQL](https://azure.microsoft.com/en-us/services/sql-database/) database.

Current NHS trusts using the service have been set up with a fork of this
repository to enable their own feature development and the ability to receive
updates from Made Tech. This consists of the following dependencies:

- [Microsoft Azure](https://azure.microsoft.com/) - to build and host the application
- [GitHub Actions](https://github.com/features/actions) - to run automated tests on a pull request
- [GOV.UK Notify](https://www.notifications.service.gov.uk) - to send text
  messages and emails
- [Whereby](https://whereby.com/information/product-api/) - to enable video
  calls
- [DataDog](https://www.datadoghq.com/) - to log and monitor uncaught errors and
  exceptions

## Purpose

The main purpose of this runbook is to provide documentation for setting up the
application as described in the overview. That being said, it's entirely
possible to replace these services with ones that work best for your trust.

## Setting up the application

To get the application running like current NHS trusts:

1. [Setting up your repository](./01-setting-up-your-repo.md)
1. [GOV.UK Notify Templates](./02-govuk-notify-templates.md)
1. [Setting up CircleCI](./03-setting-up-circle-ci.md)
1. [Setting up CI on Github Actions](./04-setting-up-ci-on-github-actions.md)
1. [Setting up Sentry](./05-setting-up-sentry.md)
1. [Setting up Whereby](./06-setting-up-whereby.md)
1. [Deploying to Heroku](./07-deploying-to-heroku.md)

## Other documentation

For maintenance and other miscellaneous tasks:

- [Setting up Heroku CLI](./setting-up-heroku-cli.md)
- [Accessing the database of a Heroku app](./accessing-heroku-app-database.md)
- [Migrating the database](./migrating-the-database.md)
