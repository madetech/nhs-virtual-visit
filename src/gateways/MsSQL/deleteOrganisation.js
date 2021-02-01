import logger from "../../../logger";
import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (organisationId) => {
  try {
    console.log(JSON.stringify(organisationId));

    const db = await getMsSqlConnPool();
    await db
      .request()
      .input("organisationId", mssql.Int, organisationId)
      .query("DELETE FROM dbo.[organisation] WHERE id = @organisationId");

    return {
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error deleting organisation with id: ${organisationId}, ${error}`
    );
    return {
      error: error.toString(),
    };
  }
};
