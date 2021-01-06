export default async ({ getMsSqlConnPool }) => {
  const db = await getMsSqlConnPool();
  // await db.any("DELETE from events");
  // await db.any("DELETE from ward_visit_totals");
  // await db.any("DELETE from scheduled_calls_table");

  // const [{ exists: patientDetailsTableExists }] = await db.any(`
  //   SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patient_details')
  // `);
  // if (patientDetailsTableExists) await db.any("DELETE from patient_details");

  // const [{ exists: visitorDetailsTableExists }] = await db.any(`
  //   SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'visitor_details')
  // `);
  // if (visitorDetailsTableExists) await db.any("DELETE from visitor_details");
  await db.request().query("DELETE from dbo.[user]");
  await db.request().query("DELETE from dbo.[organisation]");
  // await db.any("DELETE from hospitals");
  // await db.any("DELETE from trusts");
  // await db.any("DELETE from admins");
};
