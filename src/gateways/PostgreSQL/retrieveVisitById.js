import { SCHEDULED, COMPLETE } from "../../../src/helpers/visitStatus";

const retrieveVisitById = ({ getDb }) => async ({ id, wardId }) => {
  try {
    const db = await getDb();
    const scheduledCall = await db.one(
      `SELECT *,
      (
        SELECT patient_name
        FROM patient_details
        WHERE scheduled_calls_table.patient_details_id = id
      ) as patient_name,
      (
        SELECT recipient_name
        FROM visitor_details
        WHERE scheduled_calls_table.visitor_details_id = id
      ),
      (
        SELECT recipient_email
        FROM visitor_details
        WHERE scheduled_calls_table.visitor_details_id = id
      ),
      (
        SELECT recipient_number
        FROM visitor_details
        WHERE scheduled_calls_table.visitor_details_id = id
      ) as recipient_number
      FROM scheduled_calls_table
      WHERE id = $1 AND ward_id = $2 AND status = ANY(ARRAY[$3,$4]::text[]) AND pii_cleared_at IS NULL
      LIMIT 1`,
      [id, wardId, SCHEDULED, COMPLETE]
    );

    return {
      scheduledCall: {
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
        recipientName: scheduledCall.recipient_name,
        recipientNumber: scheduledCall.recipient_number,
        recipientEmail: scheduledCall.recipient_email,
        callTime: scheduledCall.call_time,
        callId: scheduledCall.call_id,
        provider: scheduledCall.provider,
        callPassword: scheduledCall.call_password,
        status: scheduledCall.status,
      },
      error: null,
    };
  } catch (error) {
    return {
      scheduledCall: null,
      error: error.message,
    };
  }
};

export default retrieveVisitById;
