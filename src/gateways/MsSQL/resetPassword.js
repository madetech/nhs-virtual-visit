import bcrypt from "bcryptjs";

export default ({ getMsSqlConnPool, logger }) => async ({ password, email }) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    logger.info(`Resetting password for email: ${email}`);
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("email", email)
      .input("password", hashedPassword)
      .query(
        `UPDATE dbo.[user] SET password = @password OUTPUT inserted.email WHERE email = @email`
      );

    if (!res.recordset[0]) {
      throw `Error resetting password for email ${email}`;
    }
    return {
      resetSuccess: true,
      error: null,
    };
  } catch (error) {
    logger.error(`Error resetting password for email: ${email} ${error}`);

    return {
      resetSuccess: false,
      error: error.toString(),
    };
  }
};
