export default async function retreiveVisits({ getDb }) {
  const db = getDb();
  try {
    const scheduledCalls = await db.any("SELECT * FROM scheduled_calls_table");

    return {
      scheduledCalls: scheduledCalls.map((scheduledCall) => ({
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
        recipientNumber: scheduledCall.recipient_number,
        callTime: scheduledCall.call_time.toISOString(),
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
