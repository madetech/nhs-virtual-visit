import logger from "../../logger";
import { CANCELLED } from "../../src/helpers/visitStatus";

const deleteVisitByCallId = ({ getDb }) => async (callId) => {
  const db = await getDb();
  // might need to be in []
  logger.info(`deleting visit for callId ${callId}`, callId);
  try {
    const results = await db.any(
      `UPDATE scheduled_calls_table SET status = $1 WHERE call_id = $2`,
      [CANCELLED, callId]
    );
    logger.info(`${results}, success=true`, results);
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: error.toString(),
    };
  }
};

export default deleteVisitByCallId;
