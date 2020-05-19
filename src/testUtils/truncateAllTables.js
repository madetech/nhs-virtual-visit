export default async ({ getDb }) => {
  const db = await getDb();
  await db.any("DELETE from scheduled_calls_table");
  await db.any("DELETE from wards");
  await db.any("DELETE from hospitals");
  await db.any("DELETE from trusts");
  await db.any("DELETE from ward_visit_totals");
};
