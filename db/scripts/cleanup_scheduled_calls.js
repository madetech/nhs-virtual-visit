const status = require("../../src/helpers/visitStatus");

async function getDb() {
  const dotenv = require("dotenv");
  dotenv.config();

  const pgp = require("pg-promise")({});

  let options = {
    connectionString:
      process.env.NODE_ENV === "test" || process.env.APP_ENV === "test"
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL,
  };

  if (process.env.NODE_ENV === "production") {
    options.ssl = { rejectUnauthorized: false };
  }

  return pgp(options);
}

async function cleanupScheduledCalls() {
  const db = await getDb();

  const scheduledCalls = await db.result(
    `UPDATE scheduled_calls_table
     SET patient_name = null, recipient_number = null, recipient_name = null, recipient_email = null, status = $1, pii_cleared_at = NOW()
     WHERE call_time < (now() - INTERVAL '1 DAY') AND status = $2 AND pii_cleared_at IS NULL`,
    [status.COMPLETE, status.SCHEDULED]
  );

  const archivedCalls = await db.result(
    `UPDATE scheduled_calls_table
     SET patient_name = null, recipient_number = null, recipient_name = null, recipient_email = null, pii_cleared_at = NOW()
     WHERE status = $1 AND pii_cleared_at IS NULL`,
    status.ARCHIVED
  );

  const cancelledCalls = await db.result(
    `UPDATE scheduled_calls_table
     SET patient_name = null, recipient_number = null, recipient_name = null, recipient_email = null, pii_cleared_at = NOW()
     WHERE status = $1 AND pii_cleared_at IS NULL`,
    status.CANCELLED
  );

  db.$pool.end();

  return {
    completed: scheduledCalls.rowCount,
    archived: archivedCalls.rowCount,
    cancelled: cancelledCalls.rowCount,
  };
}

cleanupScheduledCalls()
  .then(function (result) {
    console.log(`
    ${result.completed} visits completed
    ${result.archived} visits archived
    ${result.cancelled} visits cancelled`);
  })
  .catch((error) => {
    console.error("ERROR:", error);
  });

exports.cleanupScheduledCalls = cleanupScheduledCalls;
