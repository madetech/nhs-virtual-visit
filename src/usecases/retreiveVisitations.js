export default async function retreiveVisitations({ getDb }) {
  const db = getDb();
  try {
    const scheduledCalls = await db.any(
      "SELECT * FROM scheduled_calls_table WHERE call_time > NOW() - INTERVAL '30 minutes' ORDER BY call_time DESC"
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
      })),
      error: null,
    };
  } catch (error) {
    return {
      scheduledCalls: null,
      error: error.toString(),
    };
  }
}
