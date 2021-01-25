import logger from "../../logger";

const retrieveManagerByUuid = ({ getRetrieveManagerByUuidGateway }) => async (
  uuid
) => {
  if (uuid === undefined) {
    return { manager: null, error: "uuid must be provided." };
  }
  try {
    logger.info(`Retrieving manager for ${uuid}`);

    let manager = await getRetrieveManagerByUuidGateway()(uuid);

    const status = manager.status === 1 ? "active" : "disabled";
    manager = { ...manager, status };
    return { manager, error: null };
  } catch (error) {
    return { manager: null, error: "There was an error retrieving a manager." };
  }
};

export default retrieveManagerByUuid;
