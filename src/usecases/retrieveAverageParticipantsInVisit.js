const retrieveAverageParticipantsInVisit = ({ getDb }) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const db = await getDb();
  const [{ average_participants: averageParticipantsInVisit }] = await db.any(
    `SELECT AVG(participants) as average_participants
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

export default retrieveAverageParticipantsInVisit;
