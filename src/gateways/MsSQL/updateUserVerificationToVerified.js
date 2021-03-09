const updateUserVerificationToVerifiedGateway = ({ getMsSqlConnPool, logger }) => async ({
  hash,
  verified
}) => {
  logger.info("Updating user verification table row to verfied");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("hash", hash)
      .input("verified", verified)
      .query(
        `UPDATE dbo.[user_verification] SET verified = @verified OUTPUT inserted.id WHERE hash = @hash`
      );

    if (response.recordset.length > 0) {
      logger.info(`Verified column for entry with hash ${hash} has been updated in user_verification table`);
      return {
        success: true,
        error: null,
      };
    }

    logger.error(`Error: Hash ${hash} could not be found in the user_verification table`);
    return {
      success: false,
      error: "The hash could not be found in the user_verification table",
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
