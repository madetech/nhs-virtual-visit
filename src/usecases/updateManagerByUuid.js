import logger from "../../logger";

const updateManagerByUuid = ({
  getMsSqlConnPool,
  getUpdateManagerByUuidGateway,
}) => async ({ uuid, status }) => {
  try {
    logger.info(`Updating manager for ${uuid}`);
    const db = await getMsSqlConnPool();
    await getUpdateManagerByUuidGateway()(db, uuid, status);
    return { uuid, error: null };
  } catch (error) {
    console.log(error);
    return { uuid: null, error: "There was an error updating a manager." };
  }
};

export default updateManagerByUuid;
