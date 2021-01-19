export default ({ getDb }) => async (hospitalId) => {
  const db = await getDb();

  const queryResult = await db.any(
    `SELECT
      wards.id as ward_id,
      wards.name as ward_name,
      COALESCE(SUM(totals.total),0) AS total_visits
    FROM wards
    LEFT JOIN ward_visit_totals AS totals ON wards.id = totals.ward_id
    WHERE wards.hospital_id = $1 AND wards.archived_at IS NULL
    GROUP BY wards.id`,
    [hospitalId]
  );

  let wards = {};

  queryResult.forEach(({ ward_id, total_visits }) => {
    wards[ward_id] = parseInt(total_visits);
  });

  const sortedByTotalVisitsDescending = queryResult.sort(
    (a, b) => b.total_visits - a.total_visits
  );

  return { wards, sortedByTotalVisitsDescending };
}