export default ({ getDb }) => async (trustId) => {
  const db = await getDb();

  const queryResult = await db.any(
    `SELECT
      hospitals.id as hospital_id,
      SUM(totals.total) AS total_visits
    FROM ward_visit_totals AS totals
      JOIN wards ON wards.id = totals.ward_id
      JOIN hospitals ON wards.hospital_id = hospitals.id
    WHERE hospitals.trust_id = $1
    GROUP BY hospitals.id`,
    [trustId]
  );

  return {
    byHospital: queryResult.map(({ hospital_id, total_visits }) => ({
      hospitalId: hospital_id,
      totalVisits: parseInt(total_visits),
    })),
  };
};
