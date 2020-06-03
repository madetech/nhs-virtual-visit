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

  const sortedResults = queryResult.sort(
    (a, b) => b.total_visits - a.total_visits
  );

  const mostVisitedResult = sortedResults[0];
  const leastVisitedResult = sortedResults[sortedResults.length - 1];

  const mostVisited = mostVisitedResult
    ? {
        wardName: mostVisitedResult.ward_name,
        total_visits: parseInt(mostVisitedResult.total_visits),
      }
    : { wardName: "", total_visits: 0 };

  const leastVisited = leastVisitedResult
    ? {
        wardName: leastVisitedResult.ward_name,
        total_visits: parseInt(leastVisitedResult.total_visits),
      }
    : { wardName: "", total_visits: 0 };

  return { wards, mostVisited, leastVisited };
};
