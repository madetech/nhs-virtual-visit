import logger from "../../logger";
import setMostAndLeastVisitedDepartments from "../helpers/setMostAndLeastVisitedDepartments";

export default ({
  getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway,
}) => async (facilityId) => {
  if (facilityId === undefined) {
    return { total: null, error: "facility id must be provided." };
  }
  
  try {
    logger.info(`Retrieving total booked visits for facility id ${facilityId}`);
    const departments = await getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway()(facilityId);
    const { mostVisitedDepartment, leastVisitedDepartment } = setMostAndLeastVisitedDepartments(departments);
    return { 
      departments,
      mostVisitedDepartment,
      leastVisitedDepartment,
      error:null 
    };
  } catch (error) {
    logger.error(`Error retrieving total booked visits for wards ${error}`);
    return { 
      departments: null, 
      mostVisitedDepartment: null,
      leastVisitedDepartment: null,
      error: error.toString() };
  }
};