import logger from "../../logger";

export default ({
  getRetrieveTotalCompletedVisitsByOrgIdGateway,
}) => async (orgId) => {
  if (orgId === undefined) {
    return { total: null, error: "organisation id must be provided." };
  }
  
  try {
    logger.info(`Retrieving total completed visits for organisation id ${orgId}`);
    const total = await getRetrieveTotalCompletedVisitsByOrgIdGateway()({ orgId });
    return { total, error: null };
  } catch (error) {
    logger.error(`Error retrieving total completed visits ${error}`);
    return { total: null, error: error.toString() };
  }
};