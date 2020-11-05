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
      SET call_time = $1
      WHERE
          id = $2
      RETURNING *`,
      [callTime, id]
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

    const updatedVisitorDetails = await db.one(
      `
        UPDATE visitor_details
        SET recipient_name = $1,
            recipient_email = $2,
            recipient_number = $3
        WHERE id = $4
        RETURNING *
      `,
      [
        recipientName,
        recipientEmail,
        recipientNumber,
        updatedVisit.visitor_details_id,
      ]
    );

    return {
      visit: {
        id: updatedVisit.id,
        patientName: updatedPatientDetails.patient_name,
        recipientName: updatedVisitorDetails.recipient_name,
        recipientNumber: updatedVisitorDetails.recipient_number,
        recipientEmail: updatedVisitorDetails.recipient_email,
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
