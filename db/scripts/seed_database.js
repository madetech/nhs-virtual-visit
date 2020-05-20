async function getDb() {
  const dotenv = require("dotenv");
  dotenv.config();

  const pgp = require("pg-promise")({});
  const connectionURL = process.env.TEST_DATABASE_URL;
  return pgp({
    connectionString: connectionURL,
  });
}

async function seedDatabase() {
  const db = await getDb();
  await db.result(
    "INSERT INTO trusts (name, admin_code) VALUES ('Test Trust', 'admin')"
  );
  await db.result(
    "INSERT INTO hospitals (name, trust_id) VALUES ('Test Hospital', (SELECT id FROM trusts WHERE name='Test Trust'))"
  );
  await db.result(
    "INSERT INTO wards (name, hospital_id, code, trust_id) VALUES ('Test Ward One', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST1', (SELECT id FROM trusts WHERE name='Test Trust'))"
  );
  db.$pool.end();
}

seedDatabase()
  .then(() => {
    console.log(`Database seeded`);
  })
  .catch((error) => {
    console.error("ERROR:", error);
  });
