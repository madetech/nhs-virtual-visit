async function getDb() {
  const dotenv = require("dotenv");
  dotenv.config();

  const pgp = require("pg-promise")({});
  const connectionURL = process.env.TEST_DATABASE_URL;
  return pgp({
    connectionString: connectionURL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

async function seedDatabase() {
  const db = await getDb();
  await db.result(
    "INSERT INTO admins (code, password) VALUES ('super', crypt('adminpassword', gen_salt('bf', 8)))"
  );
  await db.result(
    "INSERT INTO trusts (name, admin_code, password, video_provider) VALUES ('Test Trust', 'admin', crypt('trustpassword', gen_salt('bf', 8)), 'jitsi')"
  );
  await db.result(
    "INSERT INTO hospitals (name, trust_id) VALUES ('Test Hospital', (SELECT id FROM trusts WHERE name='Test Trust'))"
  );
  const { id: wardId } = await db.one(
    "INSERT INTO wards (name, hospital_id, code, trust_id) VALUES ('Test Ward One', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST1', (SELECT id FROM trusts WHERE name='Test Trust')) RETURNING id"
  );
  await db.one(
    "INSERT INTO wards (name, hospital_id, code, trust_id) VALUES ('Test Ward Two', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST2', (SELECT id FROM trusts WHERE name='Test Trust')) RETURNING id"
  );

  await db.result(
    `INSERT INTO scheduled_calls_table
    (patient_name, recipient_email, recipient_name, call_time, call_id, provider, ward_id, call_password, status)
    VALUES ('Alice', 'bob@example.com', 'Bob', CURRENT_TIMESTAMP + interval '1 hour', '123', 'whereby', $1, 'password', 'scheduled')`,
    [wardId]
  );
  await db.result(
    `INSERT INTO scheduled_calls_table
    (patient_name, recipient_email, recipient_name, call_time, call_id, provider, ward_id, call_password, status)
    VALUES ('Elliot', 'darlene@example.com', 'Darlene', CURRENT_TIMESTAMP + interval '1 hour', '456', 'whereby', $1, 'password', 'scheduled')`,
    [wardId]
  );
  db.$pool.end();
}

seedDatabase()
  .then(() => {
    console.log(`Database seeded`);
  })
  .catch((error) => {
    console.error("ERROR:", error);
    process.exit(1);
  });
