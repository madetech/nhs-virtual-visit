import { SCHEDULED } from "../../src/helpers/visitStatus";

const createVisit = ({ getDb }) => async (visit) => {
  const db = await getDb();
  const { id, call_id } = await insertVisit(db, visit);
  return { id, callId: call_id };
};

const insertVisit = async (db, visit) => {
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
      visit.wardId,
      visit.callPassword,
      SCHEDULED,
    ]
  );

  return { id, callId: call_id };
};

export default createVisit;
