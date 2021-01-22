import logger from "../../logger";
export default ({ getRetrieveFacilityByUuidGateway }) => async (uuid) => {
  if (uuid == undefined) {
    return { facility: null, error: "uuid must be present." };
  }
  try {
    logger.info(`Retrieving hospital for ${uuid}`);
    const facility = await getRetrieveFacilityByUuidGateway()(uuid);
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
