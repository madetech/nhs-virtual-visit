import logger from "../../logger";

const updateManagerStatusByUuid = ({
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
    const returnedUuid = await getUpdateManagerStatusByUuidGateway()(
      uuid,
      status
    );
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error updating a manager." };
  }
};

export default updateManagerStatusByUuid;
