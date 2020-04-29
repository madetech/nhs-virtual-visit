const createVisit = ({ getDb }) => async (visit) => {
  const db = await getDb();

  return await db.one(
    `INSERT INTO scheduled_calls_table
      (id, patient_name, recipient_number, recipient_name, call_time, call_id, provider, ward_id)
      VALUES (default, $1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
    [
      visit.patientName,
      visit.contactNumber,
      visit.contactName || "",
      visit.callTime,
      visit.callId,
      visit.provider,
      visit.wardId,
    ]
  );
};

export default createVisit;
