export default ({ getRetrieveFacilityByUuidGateway, logger }) => async (uuid) => {
  if (uuid == undefined) {
    return { facility: null, error: "uuid must be present." };
  }
  try {
    logger.info(`Retrieving facility for ${uuid}`);
    let facility = await getRetrieveFacilityByUuidGateway()(uuid);
    facility = {
      ...facility,
      status: facility.status === 1 ? "active" : "disabled",
    };
    return { facility, error: null };
  } catch (error) {
    logger.error(`Error retrieving facility: ${error}`);
    return {
      facility: null,
      error: "There has been an error retrieving facility.",
    };
  }
};
