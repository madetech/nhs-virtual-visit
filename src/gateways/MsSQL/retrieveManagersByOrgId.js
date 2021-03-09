import mssql from "mssql";

const retrieveManagersByOrgIdGateway = ({ getMsSqlConnPool, logger }) => async (
  orgId
) => {
  logger.info(`Retrieving Managers for organisation ${orgId}`);

  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("orgId", mssql.Int, orgId)
      .query(
        "SELECT email, uuid, status, id FROM dbo.[user] WHERE organisation_id = @orgId"
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

export default retrieveManagersByOrgIdGateway;
