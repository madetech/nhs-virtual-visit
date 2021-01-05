import logger from "../../../logger";
import MsSQL from ".";

const retrieveOrgManagerByUuid = async (uuid) => {
  const db = await MsSQL.getConnectionPool();
  let orgManager = {};
  logger.info(`Retrieving organisation manager for ${uuid}`);
  try {
    if (!uuid) throw "Attempting to retrieve manager with no uuid set";

    orgManager = await db
      .request()
      .input("uuid", uuid)
      .query("SELECT * FROM dbo.[user] WHERE uuid = @uuid");

    orgManager = orgManager.recordset.map((row) => ({
      uuid: row.uuid,
      email: row.email,
      status: row.status == 1 ? "active" : "disabled",
    }))[0];

    return {
      trustManager: orgManager,
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

export default retrieveOrgManagerByUuid;
