const retrieveManagerByEmailGateway = ({ getMsSqlConnPool, logger }) => async (
  email
) => {
  logger.info(`Retrieving Manager with email ${email}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db.request().input("email", email).query(
      `SELECT id, email, uuid, type  
        FROM dbo.[user] WHERE email = @email`
    );
    if (!response.recordset[0]) {
      throw Error("Manager is undefined");
    }
    return {
      manager: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving manager ${error}`);
    return {
      manager: null,
      error: error.toString(),
    };
  }
};

export default retrieveManagerByEmailGateway;
