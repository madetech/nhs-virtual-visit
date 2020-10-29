const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  try {
    const endpoint = process.env.LOG_EVENTS_DB_ACCOUNT_ENDPOINT;
    const key = process.env.LOG_EVENTS_DB_ACCOUNT_KEY;
    const db_id = process.env.LOG_EVENTS_DB_ID;

    const client = new CosmosClient({ endpoint, key });
    const db = client.database(db_id);

    const { container } = await db.containers.createIfNotExists(
      {
        id: "event-container",
      },
      { offerThroughput: 400 }
    );

    const {
      sessionId,
      correlationId,
      createdOn,
      streamName,
      trustId,
      eventType,
      event,
    } = req.body;
    if (
      sessionId &&
      correlationId &&
      createdOn &&
      streamName &&
      trustId &&
      eventType &&
      event
    ) {
      const result = await container.items.create({
        sessionId,
        correlationId,
        createdOn,
        streamName,
        trustId,
        eventType,
        event,
      });

      context.res = {
        status: 201,
        body: `Created; body = ${JSON.stringify(
          req.body
        )}; result = ${result}; db_id = ${db_id}; endpoint = ${endpoint}; key = ${key};`,
      };
    } else {
      context.res = {
        status: 400,
        body: `Data missing from request, need data in the format: { sessionId: string, correlationId: string, createdOn: string, streamName: string, trustId: string, eventType: string, event: object }`,
      };
    }
  } catch (e) {
    context.res = {
      status: 500,
      body: `Error: ${e}`,
    };
  }
  context.done();
};
