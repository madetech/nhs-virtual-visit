export default async function retrieveVisits({ getDb }) {
  const db = await getDb();
  try {
    const scheduledCalls = await db.any(
      "SELECT * FROM scheduled_calls_table WHERE call_time > NOW() - INTERVAL '30 minutes' ORDER BY call_time ASC"
    );

    return {
      scheduledCalls: scheduledCalls.map((scheduledCall) => ({
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
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
}
