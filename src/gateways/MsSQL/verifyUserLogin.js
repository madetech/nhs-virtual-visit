import bcrypt from "bcryptjs";
import logger from "../../../logger";

const verifyUserLoginGateway = ({ getMsSqlConnPool }) => async (
  email,
  password
) => {
  logger.info(`Verify user login for email ${email}`);
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("email", email)
      .query(
        `SELECT organisation_id, password, type, id FROM dbo.[user] WHERE email = @email`
      );

    const user = response.recordset[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return {
        validUser: false,
        trust_id: null,
        type: null,
        user_id: null,
        error: "Incorrect email or password",
      };
    }

    return {
      validUser: true,
      user_id: user.id,
      trust_id: user.organisation_id,
      type: user.type,
      error: null,
    };
  } catch (error) {
    logger.error(`Error verifying user with email ${email}: ${error}`);
    const message = "Email does not exist in the database";

    return {
      validUser: false,
      user_id: null,
      trust_id: null,
      type: null,
      error: message,
    };
  }
};

export default verifyUserLoginGateway;
