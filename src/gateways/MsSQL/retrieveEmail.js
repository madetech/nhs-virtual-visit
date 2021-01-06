import logger from "../../../logger";
import MsSQL from "./";

const retrieveEmail = async (email) => {
  const db = await MsSQL.getConnectionPool();

  if (!email) {
    return {
      validEmail: false,
      error: "email is not defined",
    };
  }

  try {
    const dbResponse = await db
      .request()
      .input("email", email)
      .query(`SELECT type FROM dbo.[user] WHERE email = @email`);

    if (dbResponse.recordset.length > 0) {
      return {
        validEmail: true,
        error: null,
      };
    } else {
      return {
        validEmail: false,
        error: null,
      };
    }
  } catch (error) {
    logger.error(error);

    return {
      validEmail: null,
      error: error.toString(),
    };
  }
};

export default retrieveEmail;
