import logger from "../../../logger";

export default ({ getMsSqlConnPool }) => async ({ email }) => {
  logger.info(`Retrieving hashedPassword for email ${email}`);
  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("email", email)
      .query(
        `SELECT password AS hashedPassword, email AS emailAddress FROM dbo.[user] WHERE email = @email`
      );

    if (!res.recordset[0]) {
      throw "Error retrieving hashedPassword";
    }

    return {
      user: res.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving hashedPassword from email ${email}`);

    return {
      user: null,
      error: error.toString(),
    };
  }
};
