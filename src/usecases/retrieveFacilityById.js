export default ({ getRetrieveFacilityByIdGateway, logger }) => async (facilityId) => {
  if (facilityId == undefined) {
    return { facility: null, error: "facility id must be present." };
  }
  try {
    logger.info(`Retrieving hospital for ${facilityId}`);
    let facility = await getRetrieveFacilityByIdGateway()(facilityId);
    facility = {
      ...facility,
      status: facility.status === 1 ? "active" : "disabled",
    };
    return { facility, error: null };
  } catch (error) {
    logger.error(`Error retrieving hospital: ${error}`);
    return {
      facility: null,
      error: "There has been an error retrieving the facility.",
    };
  }
};
