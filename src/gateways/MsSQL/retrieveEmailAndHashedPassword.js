import logger from "../../../logger";
import MsSQL from "./";

const retrieveEmail = async (email) => {
  const db = await MsSQL.getConnectionPool();

  if (!email) {
    return {
      emailAddress: "",
      hashedPassword: "",
      error: "email is not defined",
    };
  }

  try {
    const dbResponse = await db
      .request()
      .input("email", email)
      .query(
        `SELECT password AS hashedPassword, email AS emailAddress FROM dbo.[user] WHERE email = @email`
      );

    if (dbResponse.recordset.length > 0) {
      const { emailAddress, hashedPassword } = dbResponse.recordset[0];

      return {
        emailAddress,
        hashedPassword,
        error: null,
      };
    } else {
      return {
        emailAddress: "",
        hashedPassword: "",
        error: "Email could not be found in database",
      };
    }
  } catch (error) {
    logger.error(error);

    return {
      emailAddress: "",
      hashedPassword: "",
      error: error.toString(),
    };
  }
};

export default retrieveEmail;
