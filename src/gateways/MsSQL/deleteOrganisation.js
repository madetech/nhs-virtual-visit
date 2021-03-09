import mssql from "mssql";

export default ({ getMsSqlConnPool, logger }) => async (organisationId) => {
  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("organisationId", mssql.Int, organisationId)
      .query(
        "DELETE FROM dbo.[organisation] OUTPUT deleted.* WHERE id = @organisationId"
      );

    if (!res.recordset[0]) {
      throw "Error deleting organisation with id";
    }
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
