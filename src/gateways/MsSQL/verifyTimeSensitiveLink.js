const verifyTimeSensitiveLinkGateway = ({ getMsSqlConnPool, logger }) => async ({
  hash,
  uuid,
}) => {
  logger.info("Verifying time sensitive link");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("hash", hash)
      .input("uuid", uuid)
      .query(
        `SELECT user_id, organisation_id, verified, status, email, hash, dbo.[user_verification].type 
          FROM dbo.[user_verification], dbo.[user] 
          WHERE hash = @hash AND uuid = @uuid`
      );

    if (!response.recordset[0]) {
      throw "Error verifying time sensitive link";
    }
    return {
      user: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error verifying time sensitive link: ${error}`);
    return {
      user: null,
      error: error.toString(),
    };
  }
};

export default verifyTimeSensitiveLinkGateway;
