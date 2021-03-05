import logger from "../../logger";

export default ({
  getRetrieveTotalBookedVisitsByOrgIdGateway,
}) => async (orgId) => {
  if (orgId === undefined) {
    return { total: null, error: "organisation id must be provided." };
  }
  
  try {
    logger.info(`Retrieving total booked visits for organisation id ${orgId}`);
    const total = await getRetrieveTotalBookedVisitsByOrgIdGateway()(orgId);
    return { total, error:null };
  } catch (error) {
    logger.error(`Error retrieving total booked visits ${error}`);
    return { total: null, error: error.toString() };
  }
};