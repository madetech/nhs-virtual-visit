const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.LOG_EVENTS_DB_ENDPOINT;
const key = process.env.LOG_EVENTS_DB_KEY;

module.exports = function (context, req) {
  try {
    const client = new CosmosClient({ endpoint, key });
    console.log(client);
  } catch (e) {
    context.res = {
      status: 500,
      body: `INTERNAL ERROR Environment: LOG_EVENTS_DB_KEY = ${process.env.LOG_EVENTS_DB_KEY}; LOG_EVENTS_DB_ENDPOINT = ${process.env.LOG_EVENTS_DB_ENDPOINT}; ${e}`,
    };
    context.done();
    return;
  }

  context.log(
    "Node.js HTTP trigger function processed a request. RequestUri=%s",
    req.originalUrl
  );

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status defaults to 200 */
      body: "Hello " + (req.query.name || req.body.name),
    };
  } else {
    context.res = {
      status: 400,
      body: `Please pass a name on the query string or in the request body. Environment: LOG_EVENTS_DB_KEY = ${process.env.LOG_EVENTS_DB_KEY}; LOG_EVENTS_DB_ENDPOINT = ${process.env.LOG_EVENTS_DB_ENDPOINT}`,
    };
  }
  context.done();
};
