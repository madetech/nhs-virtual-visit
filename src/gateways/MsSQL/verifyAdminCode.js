import bcrypt from "bcryptjs";

const verifyAdminCodeGateway = ({ getMsSqlConnPool, logger }) => async (
  email,
  password
) => {
  logger.info("Verifying admin code");
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("email", email)
      .query(`SELECT id, type, password FROM dbo.[user] WHERE email = @email`);

    const user = response.recordset[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return {
        validAdminCode: false,
        error: "Incorrect email or password",
      };
    }

    if (user.type !== "admin") {
      return {
        validAdminCode: false,
        error: "You are not an admin",
      };
    }

    return {
      validAdminCode: true,
      error: null,
    };
  } catch (error) {
    logger.error(`Error verifying admin code: ${error}`);
    const message = "There was an error verifying admin";
    return {
      validAdminCode: false,
      error: message,
    };
  }
};

export default verifyAdminCodeGateway;
