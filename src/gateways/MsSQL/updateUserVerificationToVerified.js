import logger from "../../../logger";

const updateUserVerificationToVerifiedGateway = ({ getMsSqlConnPool }) => async ({
  userId,
  verified
}) => {
  logger.info("Updating user verification table row to verfied");

  try {
    const db = await getMsSqlConnPool();
    await db
      .request()
      .input("userId", userId)
      .input("verified", verified)
      .query(
        `UPDATE dbo.[user_verification] SET verified = @verified WHERE user_id = @userId`
      );
    return {
      success: true,
      error: null,
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
