const updateVisitById = ({ getDb }) => async ({
  id,
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
      SET recipient_name = $1,
          recipient_email = $2,
          recipient_number = $3,
          call_time = $4
      WHERE
          id = $5
      RETURNING *`,
      [recipientName, recipientEmail, recipientNumber, callTime, id]
    );

    const updatedPatientDetails = await db.one(
      `
        UPDATE patient_details
        SET patient_name = $1
        WHERE id = $2
        RETURNING *
      `,
      [patientName, updatedVisit.patient_details_id]
    );

    return {
      visit: {
        id: updatedVisit.id,
        patientName: updatedPatientDetails.patient_name,
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

export default updateVisitById;
