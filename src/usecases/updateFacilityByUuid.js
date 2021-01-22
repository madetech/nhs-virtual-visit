import logger from "../../logger";

export default ({ getUpdateFacilityByUuidGateway }) => async ({
  uuid,
  status,
  name,
}) => {
  if (uuid === undefined) {
    return { uuid: null, error: "uuid must be provided." };
  }
  if (status === undefined) {
    return { uuid, error: "status must be provided." };
  }

  if (name === undefined) {
    return { uuid, error: "facility name must be provided." };
  }

  try {
    logger.info(`Updating facility ${name} with ${uuid}`);
    const returnedUuid = await getUpdateFacilityByUuidGateway()({
      uuid,
      status: status == "active" ? 0 : 1,
      name,
    });
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error updating the facility." };
  }
};
