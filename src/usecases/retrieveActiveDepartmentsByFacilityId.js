export default ({ getRetrieveActiveDepartmentsByFacilityIdGateway, logger }) => async (
  id
) => {
  if (id === undefined) {
    return { departments: null, error: "id must be provided." };
  }
  try {
    logger.info(`Retrieving deparments for facility id: ${id}`);
    let departments = await getRetrieveActiveDepartmentsByFacilityIdGateway()(
      id
    );
    if (departments == undefined) {
      throw Error();
    }
    departments = departments.map((department) => ({
      ...department,
      status: department.status === 1 ? "active" : "disabled",
    }));
    return { departments, error: null };
  } catch (error) {
    return {
      departments: null,
      error: "There was an error retrieving departments.",
    };
  }
};
