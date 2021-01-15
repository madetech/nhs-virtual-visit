import logger from "../../logger";

const archiveManagerByUuid = ({
  getMsSqlConnPool,
  getArchiveManagerByUuidGateway,
}) => async (uuid) => {
  if (uuid === undefined) {
    return { error: "uuid is must be provided." };
  }
  try {
    logger.info(`Deleting manager for ${uuid}`);
    const db = await getMsSqlConnPool();
    await getArchiveManagerByUuidGateway()(db, uuid);
    return { error: null };
  } catch (error) {
    return { error: "There was an error deleting a manager." };
  }
};

export default archiveManagerByUuid;
