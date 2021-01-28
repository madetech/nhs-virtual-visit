import logger from "../../../logger";

const updateLinkStatusByHashGateway = ({ getMsSqlConnPool }) => async ({
  hash,
  verified,
}) => {
  logger.info("Updating verified field in user verification table");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("hash", hash)
      .input("verified", verified)
      .query(
        `UPDATE dbo.[user_verification] SET verified = @verified OUTPUT inserted.* WHERE hash = @hash`
      );

    return {
      userVerification: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error Updating verified field in user verification table ${error}`
    );
    return {
      userVerification: null,
      error: error.toString(),
    };
  }
};

export default updateLinkStatusByHashGateway;
