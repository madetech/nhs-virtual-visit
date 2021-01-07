import logger from "../../../logger";
import MsSQL from ".";

const updateManagerByUuid = async ({ uuid, status }) => {
  const db = await MsSQL.getConnectionPool();

  logger.info(`Updating organisation manager for ${uuid}`);
  try {
    if (!uuid)
      throw "Attempting to retrieve organisation manager with no uuid set";
    const updatedStatus = status === "active" ? 1 : 0;
    const manager = await db
      .request()
      .input("uuid", uuid)
      .input("status", updatedStatus)
      .query(
        "UPDATE dbo.[user] SET status = @status OUTPUT deleted.uuid WHERE uuid = @uuid"
      );

    return {
      uuid: manager.recordset[0].uuid,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    console.log(error);
    return {
      error: error.toString(),
    };
  }
};

export default updateManagerByUuid;
