import { SCHEDULED } from "../../src/helpers/visitStatus";

const insertVisit = () => async (db, visit, wardId) => {
  const { id, call_id } = await db.one(
    `INSERT INTO scheduled_calls_table
      (id, patient_name, recipient_email, recipient_number, recipient_name, call_time, call_id, provider, ward_id, call_password, status)
      VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, call_id
    `,
    [
      visit.patientName,
      visit.contactEmail || "",
      visit.contactNumber || "",
      visit.contactName || "",
      visit.callTime,
      visit.callId,
      visit.provider,
      wardId,
      visit.callPassword,
      SCHEDULED,
    ]
  );

  return { id, callId: call_id };
};

export default insertVisit;
