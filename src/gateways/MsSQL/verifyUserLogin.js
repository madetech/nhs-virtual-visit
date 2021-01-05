import bcrypt from "bcryptjs";
import logger from "../../../logger";
import MsSQL from "./";

const verifyUserLogin = async (email, password) => {
  const db = await MsSQL.getConnectionPool();

  if (!password) {
    return {
      validUser: false,
      trust_id: null,
      type: null,
      error: "password is not defined",
    };
  }

  try {
    const dbResponse = await db
      .request()
      .input("email", email)
      .query(
        `SELECT organisation_id, password, type FROM dbo.[user] WHERE email = @email`
      );

    if (dbResponse.recordset.length > 0) {
      const user = dbResponse.recordset[0];
      if (!bcrypt.compareSync(password, user.password))
        return {
          validUser: false,
          trust_id: null,
          type: null,
          error: "Incorrect email or password",
        };

      return {
        validUser: true,
        trust_id: user.organisation_id,
        type: user.type,
        error: null,
      };
    } else {
      return {
        validUser: false,
        trust_id: null,
        type: null,
        error: null,
      };
    }
  } catch (error) {
    logger.error(error);

    return {
      validUser: false,
      trust_id: null,
      type: null,
      error: error.toString(),
    };
  }
};

export default verifyUserLogin;
