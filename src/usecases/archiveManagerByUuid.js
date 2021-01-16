import logger from "../../logger";

const archiveManagerByUuid = ({
  getMsSqlConnPool,
  getArchiveManagerByUuidGateway,
}) => async (uuid) => {
  if (uuid === undefined) {
    return { uuid, error: "uuid is must be provided." };
  }
  try {
    logger.info(`Deleting manager for ${uuid}`);
    const db = await getMsSqlConnPool();
    const returnedUuid = await getArchiveManagerByUuidGateway()(db, uuid);
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error deleting a manager." };
  }
};

export default archiveManagerByUuid;
