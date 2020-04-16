const createVisitation = ({ getDb }) => async (visitation) => {
  const db = getDb();

  console.log("Creating visitation for ", visitation);
  return await db.one(
    `INSERT INTO scheduled_calls_table
      (id, patient_name, recipient_number, call_time, call_id)
      VALUES (default, $1, $2, $3, $4)
      RETURNING id
    `,
    [
      visitation.patientName,
      visitation.contactNumber,
      visitation.callTime,
      visitation.callId,
    ]
  );
};

export default createVisitation;
