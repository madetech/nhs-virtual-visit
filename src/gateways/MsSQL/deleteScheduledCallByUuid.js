import { statusToId, CANCELLED } from "../../helpers/visitStatus";

const deleteScheduledCallByUuidGateway = ({ getMsSqlConnPool, logger }) => async (
  uuid
) => {
  logger.info(`Cancelling Visit ${uuid}`);

  try {
    const db = await getMsSqlConnPool();
    const results = await db
      .request()
      .input("uuid", uuid)
      .input("status", statusToId(CANCELLED))
      .query(
        `UPDATE dbo.[scheduled_call] SET status = @status WHERE uuid = @uuid`
      );

    if (results.rowsAffected[0] !== 0) {
      logger.info(`${results}, success=true`, results);
      return {
        success: true,
        error: null,
      };
    }

    logger.error(`Error: ${uuid} could not be found in the database`);
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

export default deleteScheduledCallByUuidGateway;
