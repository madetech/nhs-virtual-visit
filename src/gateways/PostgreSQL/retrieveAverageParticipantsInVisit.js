export default ({ getDb }) => async (trustId) => {
  const db = await getDb();
  const [{ average_participants: averageParticipantsInVisit }] = await db.any(
    `SELECT to_char(COALESCE(AVG(participants), 0), '999D9') as average_participants
    FROM (SELECT COUNT ( DISTINCT session_id ) AS participants
          FROM events
          LEFT JOIN scheduled_calls_table ON events.visit_id = scheduled_calls_table.id
          LEFT JOIN wards ON scheduled_calls_table.ward_id = wards.id
          LEFT JOIN trusts ON wards.trust_id = trusts.id
          WHERE trusts.id = $1
          GROUP BY events.visit_id) distinct_session_counts_per_visit`,
    trustId
  );

  return {
    averageParticipantsInVisit: parseFloat(averageParticipantsInVisit),
    error: null,
  };
};
