const createVisit = ({ getDb }) => async (visit) => {
  const db = getDb();

  console.log("Creating visit for ", visit);
  return await db.one(
    `INSERT INTO scheduled_calls_table
      (id, patient_name, recipient_number, call_time, call_id)
      VALUES (default, $1, $2, $3, $4)
      RETURNING id
    `,
    [visit.patientName, visit.contactNumber, visit.callTime, visit.callId]
  );
};

export default createVisit;
