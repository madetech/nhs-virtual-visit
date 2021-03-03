import logger from "../../../logger";

const retrieveUserVerificationByUserId = ({ getMsSqlConnPool }) => async (
  userId
) => {
  logger.info(`Retrieving user verification entry for userId: ${userId}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("userId", userId)
      .query(
        `SELECT * FROM dbo.[user_verification] WHERE user_id = @userId`
      );
    const responseLength = response.recordset.length;
    console.log("*********Gateway*********");
    console.log(responseLength);
    console.log(response.recordset[responseLength - 1]);
    return {
      verifyUser: response.recordset[responseLength - 1],
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving user verification entry for userId: ${userId}`);
    return { 
      verifyUser: null,
      error: error.toString(),
    };
  }
};

export default retrieveUserVerificationByUserId;
