import bcrypt from "bcryptjs";
import logger from "../../../logger";
import MsSQL from "./";

const resetPassword = async ({ password, email }) => {
  const db = await MsSQL.getConnectionPool();

  if (!password) {
    return {
      resetSuccess: false,
      error: "password is not defined",
    };
  }

  if (!email) {
    return {
      resetSuccess: false,
      error: "email is not defined",
    };
  }

  try {
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    const dbResponse = await db
      .request()
      .input("email", email)
      .input("password", hashedPassword)
      .query(
        `UPDATE dbo.[user] SET password = @password OUTPUT inserted.email WHERE email = @email`
      );
    console.log("*****dbResponse*****");
    console.log(dbResponse);
    if (dbResponse.recordset.length > 0) {
      console.log("in if block");
      return {
        resetSuccess: true,
        error: null,
      };
    } else {
      console.log("in else block");
      return {
        resetSuccess: false,
        error: "User email doesn't exist",
      };
    }
  } catch (error) {
    logger.error(error);

    return {
      resetSuccess: false,
      error: error.toString(),
    };
  }
};

export default resetPassword;
