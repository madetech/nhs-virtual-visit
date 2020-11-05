import logger from "../../logger";
import { SCHEDULED, COMPLETE } from "../../src/helpers/visitStatus";

const retrieveVisits = ({ getDb }) => async ({ wardId }) => {
  const db = await getDb();
  try {
    let query = `SELECT *,
                 (
                   SELECT patient_name
                   FROM patient_details
                   WHERE scheduled_calls_table.patient_details_id = id
                 ),
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
                 WHERE scheduled_calls_table.ward_id = $1 AND status = ANY(ARRAY[$2,$3]::text[])
                 AND pii_cleared_at IS NULL
                 ORDER BY call_time ASC`;

    const scheduledCalls = await db.any(query, [wardId, SCHEDULED, COMPLETE]);

    return {
      scheduledCalls: scheduledCalls.map((scheduledCall) => ({
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
        recipientName: scheduledCall.recipient_name,
        recipientNumber: scheduledCall.recipient_number,
        recipientEmail: scheduledCall.recipient_email,
        callTime: scheduledCall.call_time
          ? scheduledCall.call_time.toISOString()
          : null,
        callId: scheduledCall.call_id,
        provider: scheduledCall.provider,
        status: scheduledCall.status,
      })),
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      scheduledCalls: null,
      error: error.toString(),
    };
  }
};

export default retrieveVisits;
