
import logger from "../../../logger";

export default ({ getMsSqlConnPool }) => async (
  organisationId
) => {
  logger.info(`Retrieving organisation with id: ${organisationId}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("organisationId", organisationId)
      .query("SELECT * FROM dbo.[organisation] WHERE id = @organisationId");

    return {
      organisation: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error retrieving organisation with id: ${organisationId}, ${error}`
    );
    return {
      organisation: null,
      error: error.toString(),
    };
  }
};