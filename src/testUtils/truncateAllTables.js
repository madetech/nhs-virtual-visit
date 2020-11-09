export default async ({ getDb }) => {
  const db = await getDb();
  await db.any("DELETE from events");
  await db.any("DELETE from ward_visit_totals");
  await db.any("DELETE from scheduled_calls_table");
  const [{ exists: patientDetailsTableExists }] = await db.any(`
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patient_details')
  `);
  if (patientDetailsTableExists) await db.any("DELETE from patient_details");
  await db.any("DELETE from wards");
  await db.any("DELETE from hospitals");
  await db.any("DELETE from trusts");
  await db.any("DELETE from admins");
};
