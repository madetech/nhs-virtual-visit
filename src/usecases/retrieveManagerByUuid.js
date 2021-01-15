import logger from "../../logger";

const retrieveManagerByUuid = ({
  getMsSqlConnPool,
  getRetrieveManagerByUuidGateway,
}) => async (uuid) => {
  if (uuid === undefined) {
    return { manager: null, error: "uuid must be provided." };
  }
  try {
    logger.info(`Retrieving manager for ${uuid}`);
    const db = await getMsSqlConnPool();
    let manager = await getRetrieveManagerByUuidGateway()(db, uuid);

    const status = manager.status === 1 ? "active" : "disabled";
    manager = { ...manager, status };
    return { manager, error: null };
  } catch (error) {
    return { manager: null, error: "There was an error retrieving a manager." };
  }
};

export default retrieveManagerByUuid;
