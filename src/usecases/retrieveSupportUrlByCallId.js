const retrieveSupportUrlByCallId = ({ getDb }) => async (callId) => {
  if (!callId) return { error: "A callId must be provided." };

  const db = await getDb();

  try {
    const { support_url: supportUrl } = await db.one(
      `SELECT hospitals.support_url AS support_url
      FROM hospitals
      LEFT JOIN wards ON wards.hospital_id = hospitals.id
      LEFT JOIN scheduled_calls_table ON scheduled_calls_table.ward_id = wards.id
      WHERE scheduled_calls_table.call_id = $1
      LIMIT 1`,
      callId
    );

    return { supportUrl, error: null };
  } catch (error) {
    return { supportUrl: null, error: error.message };
  }
};

export default retrieveSupportUrlByCallId;
