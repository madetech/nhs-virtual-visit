# Runbook

## Overview

NHS Book a virtual visit is a web application that connects patients to their
loved ones via video call. It's built using [Next.js](https://nextjs.org/) with
[Microsoft SQL Server](https://www.microsoft.com/sql-server) and hosted on [Microsoft Azure](https://azure.microsoft.com/).

Current NHS trusts using the service have been set up with a fork of this
repository to enable their own feature development and the ability to receive
updates from Made Tech. This consists of the following dependencies:

- [Microsoft Azure](https://azure.microsoft.com/) - to build and host the application
- [Terraform](https://www.terraform.io/) - to build, manage and deploy infrastructure to Azure
- [GitHub Actions](https://github.com/features/actions) - to run automated tests on a pull request
- [GOV.UK Notify](https://www.notifications.service.gov.uk) - to send text
  messages and emails
- [Whereby](https://whereby.com/information/product-api/) - to enable video
  calls
- [DataDog](https://www.datadoghq.com/) and [Sentry](https://sentry.io) - to log and monitor uncaught errors and exceptions

## Purpose

The main purpose of this runbook is to provide documentation for setting up the
application as described in the overview. That being said, it's entirely
possible to replace these services with ones that work best for you.

## Setting up the application

To get the application running like current NHS trusts:

1. [Setting up your repository](./01-setting-up-your-repo.md)
1. [GOV.UK Notify Templates](./02-govuk-notify-templates.md)
1. [Setting up DataDog](./03-setting-up-datadog.md)
1. [Setting up CI on Github Actions](./04-setting-up-ci-on-github-actions.md)
1. [Setting up Sentry](./05-setting-up-sentry.md)
1. [Setting up Whereby](./06-setting-up-whereby.md)
1. [Setting up Terraform](./07-setting-up-terraform.md)
1. [Deploying to Azure](./08-deploying-to-azure.md)

## Other documentation

For maintenance and other miscellaneous tasks:

- [Migrating the database](./migrating-the-database.md)
