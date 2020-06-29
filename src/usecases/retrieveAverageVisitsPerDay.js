const retrieveAverageVisitsPerDay = ({ getDb }) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const db = await getDb();
  const [{ average_visits_per_day: averageVisitsPerDay }] = await db.any(
    `SELECT to_char(COALESCE(AVG(visits), 0), '999D9') as average_visits_per_day FROM(
      SELECT COUNT (distinct events.visit_id ) AS visits
      FROM events
      LEFT JOIN scheduled_calls_table ON events.visit_id = scheduled_calls_table.id
      LEFT JOIN wards ON scheduled_calls_table.ward_id = wards.id
      LEFT JOIN trusts ON wards.trust_id = trusts.id
      WHERE trusts.id = $1 AND events.action='join-visit'
      GROUP BY date(scheduled_calls_table.call_time)
    ) daily_visits`,
    trustId
  );

  return {
    averageVisitsPerDay: parseFloat(averageVisitsPerDay),
    error: null,
  };
};

export default retrieveAverageVisitsPerDay;
