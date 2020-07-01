const retrieveSurveyUrlByCallId = ({ getDb }) => async (callId) => {
  if (!callId) return { error: "A callId must be provided." };

  const db = await getDb();

  try {
    const { survey_url: surveyUrl } = await db.one(
      `SELECT hospitals.survey_url AS survey_url
      FROM hospitals
      LEFT JOIN wards ON wards.hospital_id = hospitals.id
      LEFT JOIN scheduled_calls_table ON scheduled_calls_table.ward_id = wards.id
      WHERE scheduled_calls_table.call_id = $1
      LIMIT 1`,
      callId
    );

    return { surveyUrl, error: null };
  } catch (error) {
    return { surveyUrl: null, error: error.message };
  }
};

export default retrieveSurveyUrlByCallId;
