# 3. Setting up CircleCI

The application is configured to run automated tests via [CircleCI](https://circleci.com/). The configuration can be found in [circle.yml](../../circle.yml). Once set up, CircleCI will ensure that changes in Pull Requests pass our test suite before they are allowed to be merged.

CircleCI can be enabled for your repository by setting up a [new plan](https://github.com/marketplace/circleci). This will add CircleCI as a [status check](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) to your repo.

Once you have set up a new CircleCI plan:

1. [Enable the use of 3rd party orbs](https://circleci.com/docs/2.0/orbs-faq/#using-3rd-party-orbs)
1. [Set the required environment variables for the project](https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project)

## Required environment variables

- API_KEY
  - GOV.UK Notify test key
  - It's important to use a [test key](https://docs.notifications.service.gov.uk/rest-api.html#test) so that so that the service only pretends to send out messages

And the following GOV.UK Notify template IDs

- SMS_INITIAL_TEMPLATE_ID
- SMS_JOIN_TEMPLATE_ID
- EMAIL_INITIAL_TEMPLATE_ID
- EMAIL_JOIN_TEMPLATE_ID
- SMS_UPDATED_VISIT_TEMPLATE_ID
- EMAIL_UPDATED_VISIT_TEMPLATE_ID
