const addToUserVerificationTableGateway = ({ getMsSqlConnPool, logger }) => async ({
  user_id,
  code,
  hash,
  type,
}) => {
  logger.info("Adding signing up user to user verification table");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("user_id", user_id)
      .input("code", code)
      .input("hash", hash)
      .input("type", type)
      .query(
        "INSERT INTO dbo.[user_verification] ([user_id], [code], [hash], [type]) OUTPUT inserted.*  VALUES (@user_id, @code, @hash, @type)"
      );

    return {
      verifyUser: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error adding signing up user to user verification table ${error}`
    );
    return {
      verifyUser: null,
      error: error.toString(),
    };
  }
};

export default addToUserVerificationTableGateway;
