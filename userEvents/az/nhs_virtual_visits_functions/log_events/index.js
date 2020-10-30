const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, request) {
  try {
    await main(context, request, process.env);
  } catch (e) {
    context.res = {
      status: 500,
      body: `Error: ${e}`,
    };
  }
  context.done();
};

async function main(context, request, env) {
  const endpoint = env.LOG_EVENTS_DB_ACCOUNT_ENDPOINT;
  const key = env.LOG_EVENTS_DB_ACCOUNT_KEY;
  const db_id = env.LOG_EVENTS_DB_ID;

  const container = await prepare_container(endpoint, key, db_id);

  if (!(await write_event(container.items, request.body))) {
    context.res = {
      status: 400,
      body: "Data missing from request",
    };
    return;
  }

  context.res = {
    status: 201,
    body: "Created",
  };
}

async function prepare_container(endpoint, key, db_id) {
  const client = new CosmosClient({ endpoint, key });
  const db = client.database(db_id);

  const { container } = await db.containers.createIfNotExists(
    {
      id: "event-container",
    },
    { offerThroughput: 400 }
  );

  return container;
}

async function write_event(
  items,
  { sessionId, correlationId, createdOn, streamName, trustId, eventType, event }
) {
  if (
    sessionId &&
    correlationId &&
    createdOn &&
    streamName &&
    trustId &&
    eventType &&
    event
  ) {
    await items.create({
      sessionId,
      correlationId,
      createdOn,
      streamName,
      trustId,
      eventType,
      event,
    });
    return true;
  }
  return false;
}
