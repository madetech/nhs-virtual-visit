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
    await getUpdateManagerStatusByUuidGateway()(db, uuid, status);
    return { uuid, error: null };
  } catch (error) {
    console.log(error);
    return { uuid: null, error: "There was an error updating a manager." };
  }
};

export default updateManagerStatusByUuid;
