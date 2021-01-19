export default ({ getDb }) => async (trustId) => {
  const db = await getDb();

  const queryResult = await db.any(
    `SELECT
    wards.name,
    SUM(totals.total) AS total_visits,
    (
      SELECT
        name
      FROM
        hospitals
      WHERE
        id = wards.hospital_id
    ) as hospital_name,
    wards.hospital_id as hospital_id,
    wards.trust_id as trust_id
    FROM ward_visit_totals AS totals JOIN wards ON wards.id = totals.ward_id AND ($1 IS NULL OR wards.trust_id = $1)
    GROUP BY wards.trust_id, wards.hospital_id, wards.id
    ORDER BY wards.name`,
    [trustId]
  );

  return queryResult.map(({ hospital_name, total_visits, name, trust_id }) => ({
    hospitalName: hospital_name,
    name,
    visits: parseInt(total_visits),
    trustId: trust_id,
  }));
};