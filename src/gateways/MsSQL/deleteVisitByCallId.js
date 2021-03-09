import { statusToId, CANCELLED } from "../../helpers/visitStatus";

const deleteVisitByCallIdGateway = ({ getMsSqlConnPool, logger }) => async (callId) => {
  logger.info(`Cancelling Visit ${callId}`);

  try {
    const db = await getMsSqlConnPool();
    const results = await db
      .request()
      .input("callId", callId)
      .input("status", statusToId(CANCELLED))
      .query(
        `UPDATE dbo.[scheduled_call] SET status = @status WHERE uuid = @callId`
      );

    if (results.rowsAffected[0] !== 0) {
      logger.info(`${results}, success=true`, results);
      return {
        success: true,
        error: null,
      };
    }

    logger.error(`Error: ${callId} could not be found in the database`);
    return {
      success: false,
      error: "Call could not be found in the database",
    };
  } catch (error) {
    logger.error(`Error cancelling visit: ${JSON.stringify(error)}`);
    return {
      success: false,
      error: error.toString(),
    };
  }
};

export default deleteVisitByCallIdGateway;
