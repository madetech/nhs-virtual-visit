async function getDb() {
  const dotenv = require("dotenv");
  dotenv.config();

  const pgp = require("pg-promise")({});
  const connectionURL = process.env.PG_TEST_DB_URL;
  return pgp({
    connectionString: connectionURL,
  });
}

async function seedDatabase() {
  const db = await getDb();
  await db.result(
    "INSERT INTO admins (email, password) VALUES ('super@email.com', crypt('adminpassword', gen_salt('bf', 8)))"
  );
  await db.result(
    "INSERT INTO trusts (name, admin_code, password, video_provider) VALUES ('Test Trust', 'admin', crypt('trustpassword', gen_salt('bf', 8)), 'whereby')"
  );
  await db.result(
    "INSERT INTO hospitals (name, code, trust_id) VALUES ('Test Hospital', 'TBH', (SELECT id FROM trusts WHERE name='Test Trust'))"
  );
  const { id: wardId } = await db.one(
    "INSERT INTO wards (name, hospital_id, code, trust_id, pin) VALUES ('Test Ward One', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST1', (SELECT id FROM trusts WHERE name='Test Trust'), '1234') RETURNING id"
  );
  await db.one(
    "INSERT INTO wards (name, hospital_id, code, trust_id, pin) VALUES ('Test Ward Two', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST2', (SELECT id FROM trusts WHERE name='Test Trust'), '1234') RETURNING id"
  );

  await db.one(
    "INSERT INTO wards (name, hospital_id, code, trust_id, pin) VALUES ('Test Ward Two', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'super', (SELECT id FROM trusts WHERE name='Test Trust'), '1234') RETURNING id"
  );

  await db.result(
    "INSERT INTO organization (name, status) VALUES ('Test Trust', 0)"
  );

  await db.result(
    "INSERT INTO organization (name, status) VALUES ('Test Trust 2', 0)"
  );

  await db.result(
    "INSERT INTO organization (name, status) VALUES ('Test Trust 3', 0)"
  );

  await db.result(
    "INSERT INTO organization (name, status) VALUES ('Test Trust 4', 0)"
  );

  const {
    id: patientDetailsId,
  } = await db.one(
    "INSERT INTO patient_details (patient_name, ward_id) VALUES ('Alice', $1) RETURNING id",
    [wardId]
  );

  const {
    id: secondPatientDetailsId,
  } = await db.one(
    "INSERT INTO patient_details (patient_name, ward_id) VALUES ('Elliot', $1) RETURNING id",
    [wardId]
  );

  const {
    id: visitorDetailsId,
  } = await db.one(
    "INSERT INTO visitor_details (recipient_name, recipient_email, ward_id) VALUES ('Bob', 'bob@example.com', $1) RETURNING id",
    [wardId]
  );

  const {
    id: secondVisitorDetailsId,
  } = await db.one(
    "INSERT INTO visitor_details (recipient_name, recipient_email, ward_id) VALUES ('Darlene', 'darlene@example.com', $1) RETURNING id",
    [wardId]
  );

  await db.result(
    `INSERT INTO scheduled_calls_table
    (call_time, call_id, provider, ward_id, call_password, status, patient_details_id, visitor_details_id)
    VALUES (CURRENT_TIMESTAMP + interval '1 hour', '123', 'whereby', $1, 'password', 'scheduled', $2, $3)`,
    [wardId, patientDetailsId, visitorDetailsId]
  );
  await db.result(
    `INSERT INTO scheduled_calls_table
    (call_time, call_id, provider, ward_id, call_password, status, patient_details_id, visitor_details_id)
    VALUES (CURRENT_TIMESTAMP + interval '1 hour', '456', 'whereby', $1, 'password', 'scheduled', $2, $3)`,
    [wardId, secondPatientDetailsId, secondVisitorDetailsId]
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
