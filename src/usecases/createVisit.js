const createVisit = ({ getDb }) => async (visit) => {
  const db = await getDb();

  console.log("Creating visit for ", visit);
  return await db.one(
    `INSERT INTO scheduled_calls_table
      (id, patient_name, recipient_number, recipient_name, call_time, call_id, provider)
      VALUES (default, $1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [
      visit.patientName,
      visit.contactNumber,
      visit.contactName || "",
      visit.callTime,
      visit.callId,
      visit.provider,
    ]
  );
};

export default createVisit;
