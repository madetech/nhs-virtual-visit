# How to contribute

This project is owned and maintained by Made Tech, however issues and pull requests from the public are very welcome.

This document should give you an overview of the essence of the engineering team, and the standards that we hold.

## Getting Started

I recommend you read through this document to understand more on how this project operates.

For an in-depth set up guide, see the [Development Guide](docs/development/README.md).

## Clean Architecture

We try to follow Clean Architecture patterns to ensure our code is clean and concise. Clean Architecture defines clear boundaries between different parts of the service, from external `Gateways` to `usecase`s that build on business rules to perform tasks.

## Testing

We believe in Test Driven Development (TDD). This ensures we keep a high code coverage metric, and forces us to understand the crux of the problem that we're trying to solve. TDD may slow us down, but in the long run we end up with a more stable, maintainable solution.

We may reject PRs that have a lack of testing.

## Code Conventions

ESLint, and Prettier are both configured to ensure that the code in this repository is consistent - who doesn't like a bit of uniformity?

Husky will ensure that changes submitted follow the convention.

## Submitting changes

When you submit your PR, you should fill out the template to provide the reviewers with as much context as possible.

When staging PRs it's important to understand that the team break up PRs into the smallest chunks that provide value possible. This may mean there is some amount of time that dead code is in the platform, not to worry, this just means the feature is actively being worked on.

### Commit messages

Please take time to ensure that your commit messages are well formatted, and describe clearly any major decisions that have been made.
