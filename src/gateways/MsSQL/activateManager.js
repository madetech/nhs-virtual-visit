import logger from "../../../logger";

const activateManagerGateway = ({ getMsSqlConnPool }) => async ({
  userId,
  verified,
  status,
}) => {
  logger.info("Activating manager");
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("userId", userId)
      .input("verified", verified)
      .input("status", status)
      .query(
        `BEGIN TRANSACTION; 
          UPDATE dbo.[user] SET status = @status 
            OUTPUT inserted.* 
            WHERE id = @userId;
          UPDATE dbo.[user_verification] 
            SET verified = @verified 
            WHERE user_id = @userId; 
          COMMIT;`
      );

    return {
      user: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error activating manager ${error}`);
    return {
      user: null,
      error: error.toString(),
    };
  }
};

export default activateManagerGateway;
