const updateVisitByCallId = ({ getDb }) => async ({
  callId,
  patientName,
  recipientName,
  recipientEmail,
  recipientNumber,
  callTime,
}) => {
  const db = await getDb();
  try {
    const updatedVisit = await db.one(
      `UPDATE scheduled_calls_table
      SET patient_name = $1,
          recipient_name = $2,
          recipient_email = $3,
          recipient_number = $4,
          call_time = $5
      WHERE
          call_id = $6
      RETURNING *`,
      [
        patientName,
        recipientName,
        recipientEmail,
        recipientNumber,
        callTime,
        callId,
      ]
    );

    return {
      visit: {
        id: updatedVisit.id,
        patientName: updatedVisit.patient_name,
        recipientName: updatedVisit.recipient_name,
        recipientNumber: updatedVisit.recipient_number,
        recipientEmail: updatedVisit.recipient_email,
        callTime: updatedVisit.call_time,
        callId: updatedVisit.call_id,
      },
      error: null,
    };
  } catch (error) {
    return { visit: null, error: error.message };
  }
};

export default updateVisitByCallId;
