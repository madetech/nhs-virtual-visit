import logger from "../../logger";

export default ({
  getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway,
}) => async (id) => {
  try {
    if (id?.orgId) {
      logger.info(`Retrieving total completed visits for organisation id: ${id.orgId}`);
    } else if (id?.facilityId) {
      logger.info(`Retrieving total completed visits for facility id: ${id.facilityId}`);
    } else {
      throw("Id type is invalid or undefined!");
    }

    const total = await getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway()({ id: id });
    return { total, error: null };
  } catch (error) {
    logger.error(`Error retrieving total completed visits ${error}`);
    return { total: null, error: error.toString() };
  }
};