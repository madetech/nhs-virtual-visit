import { SCHEDULED } from "../../src/helpers/visitStatus";

const insertVisit = async (db, visit, wardId) => {
  const { id: patientDetailsId } = await db.one(
    `INSERT INTO patient_details
      (id, patient_name, ward_id)
      VALUES (default, $1, $2)
      RETURNING id
    `,
    [visit.patientName, wardId]
  );

  const { id, call_id } = await db.one(
    `INSERT INTO scheduled_calls_table
      (id, recipient_email, recipient_number, recipient_name, call_time, call_id, provider, ward_id, call_password, status, patient_details_id)
      VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, call_id
    `,
    [
      visit.contactEmail || "",
      visit.contactNumber || "",
      visit.contactName || "",
      visit.callTime,
      visit.callId,
      visit.provider,
      wardId,
      visit.callPassword,
      SCHEDULED,
      patientDetailsId,
    ]
  );

  return { id, callId: call_id };
};

export default insertVisit;
