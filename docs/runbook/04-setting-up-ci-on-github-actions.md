# 4. Setting up CI on Github Actions

There is a GitHub Actions [workflow](../../.github/workflows/gha-ci.yml) to run the tests when code is pushed to any branch in the GitHub repository, and when pull requests are created. The results of these test runs appear as status checks against commits on GitHub.

The following GOV.UK Notify template IDs need to be set as GitHub secrets in the GitHub repository where the tests are to be run:

- SMS_INITIAL_TEMPLATE_ID
- SMS_JOIN_TEMPLATE_ID
- EMAIL_INITIAL_TEMPLATE_ID
- EMAIL_JOIN_TEMPLATE_ID
- SMS_UPDATED_VISIT_TEMPLATE_ID
- EMAIL_UPDATED_VISIT_TEMPLATE_ID

The contract tests and E2E tests need the above IDs to be set in order to run properly. Therefore, there is a condition in the workflow around the contract tests and E2E tests such that they'll only run in the `made-tech/nhs-virtual-visit` GitHub repository. This condition can easily be extended to include other repositories (e.g. forked repositories) once that repository has the above IDs set as GitHub secrets.
