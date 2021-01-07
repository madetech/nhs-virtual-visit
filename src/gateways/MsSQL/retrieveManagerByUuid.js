import logger from "../../../logger";
import MsSQL from ".";

const retrieveManagerByUuid = async (uuid) => {
  const db = await MsSQL.getConnectionPool();

  logger.info(`Retrieving organisation manager for ${uuid}`);
  try {
    if (!uuid) throw "Attempting to retrieve manager with no uuid set";

    let manager = await db
      .request()
      .input("uuid", uuid)
      .query("SELECT * FROM dbo.[user] WHERE uuid = @uuid");

    manager = manager.recordset.map((row) => ({
      uuid: row.uuid,
      email: row.email,
      status: row.status == 1 ? "active" : "disabled",
    }))[0];

    return {
      manager,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      manager: [],
      error: error.toString(),
    };
  }
};

export default retrieveManagerByUuid;
