import logger from "../../logger";

export default ({
  getRetrieveTotalBookedVisitsByFacilityIdGateway,
}) => async (facilityId) => {
  if (facilityId === undefined) {
    return { total: null, error: "facility id must be provided." };
  }
  
  try {
    logger.info(`Retrieving total booked visits for facility id ${facilityId}`);
    const total = await getRetrieveTotalBookedVisitsByFacilityIdGateway()(facilityId);
    return { total, error: null };
  } catch (error) {
    logger.error(`Error retrieving total booked visits ${error}`);
    return { total: null, error: error.toString() };
  }
};