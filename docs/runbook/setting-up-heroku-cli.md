# Setting up Heroku CLI

[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) is a Command Line
Interface (CLI) to manage apps on its plaform using the terminal.

1. [Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
1. Verify your installation by using:

```bash
heroku --version
# heroku/7.42.5 darwin-x64 node-v12.16.2
```

You'll need to be authenticated in order to use Heroku CLI. To log in use the command:

```bash
heroku login
# heroku: Press any key to open up the browser to login or q to exit
#  ›   Warning: If browser does not open, visit
#  ›   https://cli-auth.heroku.com/auth/browser/***
# heroku: Waiting for login...
# Logging in... done
# Logged in as me@example.com
```
