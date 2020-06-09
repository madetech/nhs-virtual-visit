export default ({ getDb }) => async (trustId) => {
  const db = await getDb();

  const queryResult = await db.any(
    `SELECT
      hospitals.id as hospital_id,
      hospitals.name as hospital_name,
      SUM(totals.total) AS total_visits
    FROM ward_visit_totals AS totals
      JOIN wards ON wards.id = totals.ward_id
      JOIN hospitals ON wards.hospital_id = hospitals.id
    WHERE hospitals.trust_id = $1
    GROUP BY hospitals.id
    ORDER BY total_visits DESC`,
    [trustId]
  );
  let response = [];

  queryResult.map(({ hospital_id, hospital_name, total_visits }) => {
    response.push({
      id: hospital_id,
      name: hospital_name,
      totalVisits: parseInt(total_visits),
    });
  });

  return response;
};
