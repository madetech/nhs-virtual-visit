const retrieveReportingStartDateByTrustId = ({ getDb }) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const db = await getDb();
  try {
    const { start_date: startDate } = await db.one(
      `SELECT events.time AS start_date
      FROM events
      LEFT JOIN scheduled_calls_table ON events.visit_id = scheduled_calls_table.id
      LEFT JOIN wards ON scheduled_calls_table.ward_id = wards.id
      LEFT JOIN hospitals ON wards.hospital_id = hospitals.id
      LEFT JOIN trusts ON hospitals.trust_id = trusts.id
      WHERE trusts.id = $1
      ORDER BY time ASC
      LIMIT 1`,
      trustId
    );

    return { startDate, error: null };
  } catch (error) {
    if (error.name === "QueryResultError") {
      return { startDate: null, error: null };
    } else {
      return { startDate: null, error: error.message };
    }
  }
};

export default retrieveReportingStartDateByTrustId;
