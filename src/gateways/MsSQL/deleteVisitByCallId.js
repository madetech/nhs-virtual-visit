import logger from "../../../logger";
import { CANCELLED } from "../../../src/helpers/visitStatus";

const deleteVisitByCallIdGateway = ({ getMsSqlConnPool }) => async (callId) => {
  logger.info("Deleting Visit");

  try {
    const db = await getMsSqlConnPool();
    const results = await db
      .input(callId, "callId")
      .input(CANCELLED, status)
      .query(`DELETE FROM dbo.[scheduled_call] WHERE id = @callId`);

    logger.info(`${results}, success=true`, results);
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    logger.error(`Error deleting visit: ${JSON.stringify(error)}`);
    return {
      success: false,
      error: error.toString(),
    };
  }
};

export default deleteVisitByCallIdGateway;
