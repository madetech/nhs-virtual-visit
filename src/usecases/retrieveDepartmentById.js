export default ({ getRetrieveDepartmentByIdGateway, logger }) => async (id) => {
  if (id === undefined) {
    return { department: null, error: "id must be provided." };
  }
  try {
    logger.info(`Retrieving department for ${id}`);
    const department = await getRetrieveDepartmentByIdGateway()(id);
    return {
      department: {
        ...department,
        status: department.status === 1 ? "active" : "disabled",
      },
      error: null,
    };
  } catch (error) {
    return {
      department: null,
      error: "There was an error retrieving a department.",
    };
  }
};
