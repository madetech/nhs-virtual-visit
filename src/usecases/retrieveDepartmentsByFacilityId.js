import logger from "../../logger";

export default ({ getRetrieveDepartmentsByFacilityIdGateway }) => async (
  id
) => {
  if (id === undefined) {
    return { departments: null, error: "id must be provided." };
  }
  try {
    logger.info(`Retrieving deparments for facility id: ${id}`);
    let departments = await getRetrieveDepartmentsByFacilityIdGateway()(id);
    departments = departments.map((department) => ({
      ...department,
      status: department.status === 0 ? "active" : "disabled",
    }));
    return { departments, error: null };
  } catch (error) {
    return {
      departments: null,
      error: "There was an error retrieving a department.",
    };
  }
};
