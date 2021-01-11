import logger from "../../../logger";
import MsSQL from ".";

const retrieveManagersByOrgId = async (orgId) => {
  const db = await MsSQL.getConnectionPool();
  let managers = [];
  logger.info(`Retrieving organisation managers for ${orgId}`);
  try {
    if (!orgId)
      throw "Attempting to retrieve organisation with no organisation Id set";

    managers = await db
      .request()
      .input("org_id", orgId)
      .query("SELECT * FROM dbo.[user] WHERE organisation_id = @org_id");

    managers = managers.recordset.map((row) => ({
      uuid: row.uuid,
      email: row.email,
      status: row.status == 1 ? "active" : "disabled",
    }));

    return {
      managers,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      managers: [],
      error: error.toString(),
    };
  }
};

export default retrieveManagersByOrgId;
