export default async function retrieveVisits({ getDb }) {
  const db = getDb();

  try {
    const scheduledCalls = await db.ScheduledCall.findAll({
      where: {
        call_time: {
          $gt: db.Sequelize.literal("NOW() - INTERVAL '30 minutes'"),
        },
      },
      order: [["call_time", "ASC"]],
    });

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
