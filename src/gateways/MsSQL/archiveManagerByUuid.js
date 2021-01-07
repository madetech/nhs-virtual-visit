import logger from "../../../logger";
import MsSQL from ".";

const archiveManagerByUuid = async (uuid) => {
  const db = await MsSQL.getConnectionPool();

  logger.info(`Archiving manager for ${uuid}`);
  try {
    if (!uuid) throw "Attempting to delete a manager with no uuid set";

    const manager = await db
      .request()
      .input("uuid", uuid)
      .query("DELETE FROM dbo.[user] WHERE uuid = @uuid");

    if (manager.rowsAffected[0] === 1) {
      return {
        success: true,
        error: null,
      };
    } else {
      return {
        success: false,
        error: "Manager does not exist in database.",
      };
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    return {
      success: false,
      error: "There was a problem deleting a manager",
    };
  }
};

export default archiveManagerByUuid;
