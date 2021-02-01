import logger from "../../../logger";
import bcrypt from "bcryptjs";

const verifyAdminCodeGateway = ({ getMsSqlConnPool }) => async (
  email,
  password
) => {
  logger.info("Verifying admin code");
  try {
    const db = await getMsSqlConnPool();
    const response = db
      .input(email, "email")
      .query(`SELECT id, password FROM dbo.[user] WHERE email = @email`);

    if (response.recordset.length > 0) {
      const user = response.recordset[0];

      if (!bcrypt.compareSync(password, user.password)) {
        return {
          validAdminCode: false,
          error: "Incorrect email or password",
        };
      }

      return {
        validAdminCode: true,
        error: null,
      };
    } else {
      return {
        validAdminCode: false,
        error: null,
      };
    }
  } catch (error) {
    logger.error(`Error verifying admin code: ${error}`);
    return {
      validAdminCode: false,
      error: error.toString(),
    };
  }
};

export default verifyAdminCodeGateway;
