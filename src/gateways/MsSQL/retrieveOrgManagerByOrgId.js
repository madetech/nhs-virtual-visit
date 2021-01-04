import logger from "../../../logger";
import MsSQL from ".";

const retrieveOrgManagerByOrgId = async (orgId) => {
  const db = await MsSQL.getConnectionPool();
  let orgManagers = [];
  logger.info(`Retrieving organisation managers for ${orgId}`);
  try {
    if (!orgId)
      throw "Attempting to retrieve organisation with no organisation Id set";

    orgManagers = await db
      .request()
      .input("org_id", orgId)
      .query("SELECT * FROM dbo.[user] WHERE organisation_id = @org_id");

    orgManagers = orgManagers.recordset.map((row) => ({
      id: row.uuid,
      email: row.email,
      status: row.status == 1 ? "active" : "disabled",
    }));

    return {
      trustManagers: orgManagers,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      trustManager: [],
      error: error.toString(),
    };
  }
};

export default retrieveOrgManagerByOrgId;
