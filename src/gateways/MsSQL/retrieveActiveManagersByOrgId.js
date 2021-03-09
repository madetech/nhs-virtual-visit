import mssql from "mssql";
import { statusToId, ACTIVE } from "../../helpers/statusTypes";

export default ({ getMsSqlConnPool, logger }) => async (orgId) => {
  logger.info(`Retrieving Active Managers for organisation ${orgId}`);

  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("orgId", mssql.Int, orgId)
      .input("status", mssql.TinyInt, statusToId(ACTIVE))
      .query(
        "SELECT email, uuid, status, id FROM dbo.[user] WHERE organisation_id = @orgId AND status=@status"
      );
    return {
      managers: res.recordset,
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving managers ${error}`);
    return {
      managers: null,
      error: error.toString(),
    };
  }
};
