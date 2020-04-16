export default async function retreiveVisits({ getDb }) {
  const db = getDb();
  try {
    const scheduledCalls = await db.any("SELECT * FROM scheduled_calls_table");

    return {
      scheduledCalls: scheduledCalls.map((scheduledCall) => ({
        ...scheduledCall,
        call_time: scheduledCall.call_time.toISOString(),
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
