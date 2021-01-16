import logger from "../../logger";

const updateManagerStatusByUuid = ({
  getMsSqlConnPool,
  getUpdateManagerStatusByUuidGateway,
}) => async ({ uuid, status }) => {
  if (uuid === undefined) {
    return { uuid: null, error: "uuid must be provided." };
  }
  if (status === undefined) {
    return { uuid, error: "status must be provided." };
  }

  try {
    logger.info(`Updating manager for ${uuid}`);
    const db = await getMsSqlConnPool();
    const returnedUuid = await getUpdateManagerStatusByUuidGateway()(
      db,
      uuid,
      status
    );
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error updating a manager." };
  }
};

export default updateManagerStatusByUuid;
