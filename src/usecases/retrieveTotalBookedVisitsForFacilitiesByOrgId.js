import logger from "../../logger";
import { getMostAndLeastVisitedList } from "../helpers/getMostAndLeastVisited";

export default ({
  getRetrieveTotalBookedVisitsForFacilitiesByOrgIdGateway,
  }) => async (orgId) => {
    try {
      if (orgId === undefined) {
        return { 
          facilities: null, 
          mostVisitedList: null,
          leastVisitedList: null, 
          error: "organisation id must be provided." };
      }
      logger.info(`Retrieving total booked visits for facilities by orgaisation id ${orgId}`);
      const facilities = await getRetrieveTotalBookedVisitsForFacilitiesByOrgIdGateway()(orgId);
      if (facilities === undefined) {
        throw("RequestError: Cannot retrieve facilities!");
      }
      const { mostVisitedList, leastVisitedList } = getMostAndLeastVisitedList(facilities, 3);
      return { facilities, mostVisitedList, leastVisitedList, error: null };
     
    } catch (error) {
      return {
        facilities: null,
        mostVisitedList: null,
        leastVisitedList: null,
        error: `There has been error retrieving total booked visits for facilities: ${error.toString()}`,
      };
    }
  };
  