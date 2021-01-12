import { SCHEDULED } from "../../helpers/visitStatus";

const insertVisit = async (db, visit, wardId) => {
  const { id: patientDetailsId } = await db.one(
    `INSERT INTO patient_details
      (id, patient_name, ward_id)
      VALUES (default, $1, $2)
      RETURNING id
    `,
    [visit.patientName, wardId]
  );

  const { id: visitorDetailsId } = await db.one(
    `INSERT INTO visitor_details
      (id, recipient_name, recipient_email, recipient_number, ward_id)
      VALUES (default, $1, $2, $3, $4)
      RETURNING id
    `,
    [visit.contactName, visit.contactEmail, visit.contactNumber, wardId]
  );

  const { id } = await db.one(
    `INSERT INTO scheduled_calls_table
      (id, call_time, call_id, provider, ward_id, call_password, status, patient_details_id, visitor_details_id)
      VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, call_id
    `,
    [
      visit.callTime,
      visit.callId,
      visit.provider,
      wardId,
      visit.callPassword,
      SCHEDULED,
      patientDetailsId,
      visitorDetailsId,
    ]
  );

  return { id };
};

export default insertVisit;
