const next = require("next");
const express = require("express");
// const sslRedirect = require("heroku-ssl-redirect");
const log = require("./logger");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

console.log(`DATABASE URL: ${process.env.DATABASE_URL}`);

app
  .prepare()
  .then(() => {
    const server = express();

    // redirect to SSL
    // server.use(sslRedirect());

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      log.info(`Running as ${process.env.NODE_ENV}`);
      log.info(`Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
