import logger from "../../logger";
import { SCHEDULED, COMPLETE } from "../../src/helpers/visitStatus";

const retrieveVisitByCallId = ({ getDb }) => async (callId) => {
  const db = await getDb();
  logger.info(`Retrieving visit for ${callId}`);
  try {
    const scheduledCalls = await db.any(
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
      WHERE call_id = $1 AND status = ANY(ARRAY[$2,$3]::text[]) AND pii_cleared_at IS NULL
      LIMIT 1`,
      [callId, SCHEDULED, COMPLETE]
    );

    const scheduledCall = scheduledCalls[0];

    return {
      scheduledCall: {
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
        callPassword: scheduledCall.call_password,
      },
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      scheduledCall: null,
      error: error.toString(),
    };
  }
};

export default retrieveVisitByCallId;
