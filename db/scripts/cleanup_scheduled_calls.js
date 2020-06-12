async function getDb() {
  const dotenv = require("dotenv");
  dotenv.config();

  const pgp = require("pg-promise")({});
  const connectionURL = process.env.DATABASE_URL;
  return pgp({
    connectionString: connectionURL,
    ssl: { rejectUnauthorized: false },
  });
}

async function cleanupScheduledCalls() {
  const db = await getDb();
  const scheduledCalls = await db.result(
    `UPDATE scheduled_calls_table 
     SET patient_name = null, recipient_number = null, recipient_name = null, call_password = null, recipient_email = null, status = 'complete'
     WHERE call_time < (now() - INTERVAL '1 DAY')`
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
