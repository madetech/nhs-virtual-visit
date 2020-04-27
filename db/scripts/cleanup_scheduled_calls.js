async function getDb() {
  const dotenv = require("dotenv");
  dotenv.config();

  const pgp = require("pg-promise")({});
  const connectionURL = process.env.URI;
  return pgp({
    connectionString: connectionURL,
    ssl: { rejectUnauthorized: false },
  });
}

async function cleanupScheduledCalls() {
  const db = await getDb();
  const scheduledCalls = await db.result(
    "DELETE from scheduled_calls_table WHERE call_time < (now() - INTERVAL '1 DAY')"
  );
  return scheduledCalls;
}

cleanupScheduledCalls()
  .then(function (result) {
    console.log(`${result.rowCount} records deleted`);
  })
  .catch((error) => {
    console.error("ERROR:", error);
  });
