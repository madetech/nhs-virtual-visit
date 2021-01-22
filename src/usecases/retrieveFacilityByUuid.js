import logger from "../../logger";
export default ({ getRetrieveFacilityByUuidGateway }) => async (uuid) => {
  if (uuid == undefined) {
    return { facility: null, error: "uuid must be present." };
  }
  try {
    logger.info(`Retrieving hospital for ${uuid}`);
    let facility = await getRetrieveFacilityByUuidGateway()(uuid);
    facility = {
      ...facility,
      status: facility.status === 0 ? "active" : "disabled",
    };
    return { facility, error: null };
  } catch (error) {
    console.log(error);
    logger.error(`Error retrieving hospital: ${error}`);
    return {
      facility: null,
      error: "There has been an error retrieving hospital.",
    };
  }
};
