# 6. Deploying to Heroku

The app has been designed to easily deploy to [Heroku](https://www.heroku.com/) by including specific configuration such as a [Procfile](https://github.com/madetech/nhs-virtual-visit/blob/master/Procfile) and an [app.json](https://github.com/madetech/nhs-virtual-visit/blob/master/app.json).

## Pipelines

We recommend [creating a pipeline](https://devcenter.heroku.com/articles/pipelines) with a staging and production app.

Each app requires the [heroku/node.js buildpack](https://devcenter.heroku.com/articles/buildpacks) and uses the following add-ons: [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql), [Heroku Scheduler](https://elements.heroku.com/addons/scheduler).

For the production app you should use a professional dyno for the web app, and a standard plan Postgres add-on. While you will incur a small charge by Heroku for this, it will ensure that the application is able to handle the requests from your users. For more on scaling, please refer to the [Scaling Your Dyno Formation](https://devcenter.heroku.com/articles/scaling) documentation.

We also recommend setting up [review apps](https://devcenter.heroku.com/articles/github-integration-review-apps) so that you can easily test changes in your PRs.

## Downtime-free Deployments

Once you've carried out the necessary checks on your staging environment and wish to promote the build to production, Heroku by default will stop the older production application and then start the new production application resulting in downtime and a poor experience for your users.

Heroku has a deployment strategy called Blue Green deployments whereby the old application remains running and serving requests while the new application starts. Once the new application has started successfully, any new web requests are served by the new application.

To enable this, see the [Preboot](https://devcenter.heroku.com/articles/preboot) documentation.

## Heroku Scheduler

Every day at midnight we remove all personal identifiable information from visits that are more than a day old. To achieve this we use the [Heroku Scheduler add-on](https://devcenter.heroku.com/articles/scheduler).

Installation instructions can be found [here](https://devcenter.heroku.com/articles/scheduler#installing-the-add-on).

After enabling the Heroku Scheduler add-on for each environment in your pipeline (staging, production), create a new daily job and set the command to:

```
npm run cleandb
```

## Build timeouts

By default, Heroku sets a [60 second build timeout](https://devcenter.heroku.com/articles/limits#boot-timeout). If a build takes longer than 60 seconds to complete, the build will fail and prevent a deploy from taking place.

The majority of builds take less than 60 seconds, but on rare occasions they can take more (this happens when a new package is installed, which increases the build time as we have to wait for the installation to complete).

To get around this, we suggest setting the build timeout time to 90 seconds (which can be done via the [build timeout tool](https://tools.heroku.support/limits/boot_timeout)).
