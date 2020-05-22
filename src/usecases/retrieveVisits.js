const retrieveVisits = ({ getDb }) => async ({ wardId }) => {
  const db = await getDb();
  try {
    let query = `SELECT * FROM scheduled_calls_table WHERE ward_id = $1 ORDER BY call_time ASC`;

    const scheduledCalls = await db.any(query, [wardId]);

    return {
      scheduledCalls: scheduledCalls.map((scheduledCall) => ({
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
        recipientName: scheduledCall.recipient_name,
        recipientNumber: scheduledCall.recipient_number,
        callTime: scheduledCall.call_time
          ? scheduledCall.call_time.toISOString()
          : null,
        callId: scheduledCall.call_id,
        provider: scheduledCall.provider,
      })),
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      scheduledCalls: null,
      error: error.toString(),
    };
  }
};

export default retrieveVisits;
