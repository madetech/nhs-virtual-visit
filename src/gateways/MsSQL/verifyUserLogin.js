import bcrypt from "bcryptjs";
import { idToStatus, DISABLED } from "../../helpers/statusTypes";

const verifyUserLoginGateway = ({ getMsSqlConnPool, logger }) => async (
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
        `SELECT organisation_id, password, type, id, status FROM dbo.[user] WHERE email = @email`
      );

    const user = response.recordset[0];

    if (!bcrypt.compareSync(password, user.password)) {
      logger.error(`Incorrect password was entered form ${email}`)
      return {
        validUser: false,
        trust_id: null,
        type: null,
        user_id: null,
        error: "Incorrect email or password",
      };
    }

    if (idToStatus(user.status) === DISABLED) {
      logger.error(`The account for ${email} is disabled`);
      return {
        validUser: false,
        trust_id: null,
        type: null,
        user_id: null,
        error: "User is not active",
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
