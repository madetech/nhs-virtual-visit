import logger from "../../../logger";

const updateUserVerificationToVerifiedGateway = ({ getMsSqlConnPool }) => async ({
  userId,
  verified
}) => {
  logger.info("Updating user verification table row to verfied");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("userId", userId)
      .input("verified", verified)
      .query(
        `UPDATE dbo.[user_verification] SET verified = @verified OUTPUT inserted.id WHERE user_id = @userId`
      );

    if (response.recordset.length > 0) {
      logger.info(`Verified column for ${userId} has been updated in user_verification table`);
      return {
        success: true,
        error: null,
      };
    }

    logger.error(`Error: ${userId} could not be found in the user_verification table`);
    return {
      success: false,
      error: "The userId could not be found in the user_verification table",
    };
  } catch (error) {
    logger.error(`Error updating user verification table row to verified: ${error}`);
    return {
      success: false,
      error: error.toString(),
    };
  }
};

export default updateUserVerificationToVerifiedGateway;
