import logger from "../../logger";

const archiveManagerByUuid = ({
  getMsSqlConnPool,
  getArchiveManagerByUuidGateway,
}) => async (uuid) => {
  try {
    logger.info(`Archiving manager for ${uuid}`);
    const db = await getMsSqlConnPool();
    await getArchiveManagerByUuidGateway()(db, uuid);
    return { error: null };
  } catch (error) {
    return { error: "There was an error creating a manager." };
  }
};

export default archiveManagerByUuid;
