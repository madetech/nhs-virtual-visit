import logger from "../../../logger";

const verifySignUpLinkGateway = ({ getMsSqlConnPool }) => async ({
  hash,
  uuid,
}) => {
  logger.info("Adding signing up user to user verification table");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("hash", hash)
      .input("uuid", uuid)
      .query(
        `SELECT user_id, organisation_id, verified, status, email 
          FROM dbo.[user_verification], dbo.[user] 
          WHERE hash = @hash AND uuid = @uuid`
      );

    return {
      user: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error adding signing up user to user verification table ${error}`
    );
    return {
      user: null,
      error: error.toString(),
    };
  }
};

export default verifySignUpLinkGateway;
