export default ({ getDb }) => async (trustId, endDate) => {
  const db = await getDb();
  const results = await db.any(
    `SELECT COUNT (distinct events.visit_id) AS visits, date(scheduled_calls_table.call_time) as call_date
      FROM events
      LEFT JOIN scheduled_calls_table ON events.visit_id = scheduled_calls_table.id
      LEFT JOIN wards ON scheduled_calls_table.ward_id = wards.id
      LEFT JOIN trusts ON wards.trust_id = trusts.id
      WHERE trusts.id = $1 AND events.action='join-visit'
      GROUP BY date(scheduled_calls_table.call_time)
      ORDER BY call_date ASC`,
    trustId
  );

  let average = 0;
  if (results.length > 0) {
    const startDate = results[0].call_date;
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    endDate = endDate ?? new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);

    const totalVisits = results.reduce((total, result) => {
      return total + parseInt(result.visits);
    }, 0);

    const numberOfDays = Math.round((endDate - startDate) / 86400000); //86400000 = milliseconds in a day

    average = totalVisits / numberOfDays;
  }

  return average;
};
