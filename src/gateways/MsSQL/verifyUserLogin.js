import bcrypt from "bcryptjs";
import logger from "../../../logger";
import MsSQL from "./";

const verifyUserLogin = async (email, password) => {
  const db = await MsSQL.getConnectionPool();

  if (!email) {
    return {
      validUser: false,
      trust_id: null,
      type: null,
      user_id: null,
      error: "email is not defined",
    };
  }
  if (!password) {
    return {
      validUser: false,
      user_id: null,
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
        `SELECT organisation_id, password, type, id FROM dbo.[user] WHERE email = @email`
      );

    if (dbResponse.recordset.length > 0) {
      const user = dbResponse.recordset[0];
      console.log(user);
      if (!bcrypt.compareSync(password, user.password))
        return {
          validUser: false,
          trust_id: null,
          type: null,
          user_id: null,
          error: "Incorrect email or password",
        };

      return {
        validUser: true,
        user_id: user.id,
        trust_id: user.organisation_id,
        type: user.type,
        error: null,
      };
    } else {
      return {
        validUser: false,
        trust_id: null,
        user_id: null,
        type: null,
        error: null,
      };
    }
  } catch (error) {
    logger.error(error);

    return {
      validUser: false,
      user_id: null,
      trust_id: null,
      type: null,
      error: error.toString(),
    };
  }
};

export default verifyUserLogin;
