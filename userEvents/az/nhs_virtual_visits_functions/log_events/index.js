const { CosmosClient } = require("@azure/cosmos");

module.exports = function (context, req) {
  const endpoint = process.env.LOG_EVENTS_DB_ACCOUNT_ENDPOINT;
  const key = process.env.LOG_EVENTS_DB_ACCOUNT_KEY;
  const db_id = process.env.LOG_EVENTS_DB_ID;
  /*const client = */ new CosmosClient({ endpoint, key });

  if (
    req.body.sessionId &&
    req.body.correlationId &&
    req.body.createdOn &&
    req.body.streamName &&
    req.body.trustId &&
    req.body.eventType &&
    req.body.event
  ) {
    context.res = {
      status: 201,
      body: `Created; body = ${JSON.stringify(
        req.body
      )}; db_id = ${db_id}; endpoint = ${endpoint}; key = ${key}`,
    };
  } else {
    context.res = {
      status: 400,
      body: `Data missing from request, need data in the format: { sessionId: string, correlationId: string, createdOn: string, streamName: string, trustId: string, eventType: string, event: object }`,
    };
  }
  context.done();
};
