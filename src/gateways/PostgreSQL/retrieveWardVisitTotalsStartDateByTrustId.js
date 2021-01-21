export default ({ getDb }) => async (trustId) => {
  const db = await getDb();
  try {
    const { start_date: startDate } = await db.one(
      `SELECT ward_visit_totals.total_date AS start_date
      FROM ward_visit_totals
      LEFT JOIN wards ON ward_visit_totals.ward_id = wards.id
      LEFT JOIN hospitals ON wards.hospital_id = hospitals.id
      LEFT JOIN trusts ON hospitals.trust_id = trusts.id
      WHERE trusts.id = $1
      ORDER BY total_date ASC
      LIMIT 1`,
      trustId
    );

    return { startDate: startDate, error: null };
  } catch (error) {
    if (error.name === "QueryResultError") {
      return { startDate: null, error: null };
    } else {
      return { startDate: null, error: error.message };
    }
  }
};
