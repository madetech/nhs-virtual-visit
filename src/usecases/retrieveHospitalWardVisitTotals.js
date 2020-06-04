export default ({ getDb }) => async (hospitalId) => {
  const db = await getDb();

  const queryResult = await db.any(
    `SELECT
      wards.id as ward_id,
      wards.name as ward_name,
      SUM(totals.total) AS total_visits
    FROM ward_visit_totals AS totals
      JOIN wards ON wards.id = totals.ward_id
    WHERE wards.hospital_id = $1
    GROUP BY wards.id`,
    [hospitalId]
  );

  let wards = {};

  queryResult.map(({ ward_id, total_visits }) => {
    wards[ward_id] = parseInt(total_visits);
  });

  const sortedByTotalVisitsDescending = queryResult.sort(
    (a, b) => b.total_visits - a.total_visits
  );

  const mostVisitedWard = sortedByTotalVisitsDescending[0];
  const leastVisitedWard =
    sortedByTotalVisitsDescending[sortedByTotalVisitsDescending.length - 1];

  const mostVisited = mostVisitedWard
    ? {
        wardName: mostVisitedWard.ward_name,
        totalVisits: parseInt(mostVisitedWard.total_visits),
      }
    : { wardName: "", totalVisits: 0 };

  const leastVisited = leastVisitedWard
    ? {
        wardName: leastVisitedWard.ward_name,
        totalVisits: parseInt(leastVisitedWard.total_visits),
      }
    : { wardName: "", totalVisits: 0 };

  return { wards, mostVisited, leastVisited };
};
