import logger from "../../logger";
export default ({ getRetrieveFacilityByIdGateway }) => async (
  facilityId,
  orgId
) => {
  if (facilityId == undefined) {
    return { facility: null, error: "facility id must be present." };
  }
  if (orgId == undefined) {
    return { facility: null, error: "organisation id must be present." };
  }
  try {
    logger.info(`Retrieving hospital for ${facilityId}`);
    let facility = await getRetrieveFacilityByIdGateway()(facilityId, orgId);
    facility = {
      ...facility,
      status: facility.status === 0 ? "active" : "disabled",
    };
    return { facility, error: null };
  } catch (error) {
    logger.error(`Error retrieving hospital: ${error}`);
    return {
      facility: null,
      error: "There has been an error retrieving hospital.",
    };
  }
};
