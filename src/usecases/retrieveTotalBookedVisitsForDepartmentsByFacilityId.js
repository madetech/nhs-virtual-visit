import logger from "../../logger";
import { getMostAndLeastVisited } from "../helpers/getMostAndLeastVisited";

export default ({
  getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway,
}) => async (facilityId) => {
  if (facilityId === undefined) {
    return { 
      departments: null,
      mostVisited: null,
      leastVisited: null, 
      error: "facility id must be provided." };
  }
  
  try {
    logger.info(`Retrieving total booked visits for facility id ${facilityId}`);
    const departments = await getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway()(facilityId);
    if (departments === undefined) {
      throw("RequestError: Cannot retrieve departments!");
    }
    const { mostVisited, leastVisited } = getMostAndLeastVisited(departments);
    return { 
      departments,
      mostVisited,
      leastVisited,
      error:null 
    };
  } catch (error) {
    logger.error(`Error retrieving total booked visits for wards ${error}`);
    return { 
      departments: null, 
      mostVisited: null,
      leastVisited: null,
      error: error.toString() };
  }
};