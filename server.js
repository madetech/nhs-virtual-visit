const next = require("next");
const express = require("express");
const log = require("./logger");
const cron = require("node-cron");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      log.info(`Running as ${process.env.NODE_ENV}`);
      log.info(`Ready on http://localhost:${port}`);
    });

    cron.schedule("0 0 * * *", async () => {
      log.info("Clearing pii data");
      const response = await fetch(`http://localhost:${port}/api/delete-personal-call-information`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ clearOutTime: new Date() }),
      });
      const body = await response.json();
    
      if (response.status === 201) {
        log.info("Pii data successfully cleared");
      } else {
        log.error(`Error clearing Pii data: ${body.err}`)
      }
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
