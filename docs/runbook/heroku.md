# Deploying to heroku

The app has been designed to easily deploy to heroku.

## Pipelines

We recommend [creating a pipeline](https://devcenter.heroku.com/articles/pipelines) with a staging and production app.

Each app requires the [heroku/node.js buildpack](https://devcenter.heroku.com/articles/buildpacks) and uses the following addons: [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql), [Heroku Scheduler](https://elements.heroku.com/addons/scheduler).

We also recommend setting up [review apps](https://devcenter.heroku.com/articles/github-integration-review-apps) so that you can easily test changes in your PRs.

## Heroku Scheduler

Every day at midnight we remove all personal identifiable information from visits that are more than a day old. To achieve this we use the [Heroku Scheduler Addon](https://devcenter.heroku.com/articles/scheduler).

Installation instructions can be found [here](https://devcenter.heroku.com/articles/scheduler#installing-the-add-on).

After enabling the heroku scheduler addon for each environment in your pipeline (staging, production), create a new daily job and set the command to:

```
npm run cleandb
```

## Build timeouts

By default, heroku sets a [60 second build timeout](https://devcenter.heroku.com/articles/limits#boot-timeout). If a build takes longer than 60 seconds to complete, the build will fail and prevent a deploy from taking place.

The majority of builds take less than 60 seconds, but on rare occasions they can take more (this happens when a new package is installed, which increases the build time as we have to wait for the installation to complete).

To get around this, we suggest setting the build timeout time to 90 seconds (which can be done via the [build timeout tool](https://tools.heroku.support/limits/boot_timeout))
