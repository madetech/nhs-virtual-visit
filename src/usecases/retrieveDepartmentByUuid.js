export default ({ getRetrieveDepartmentByUuidGateway, logger }) => async (uuid) => {
  if (uuid === undefined) {
    return { department: null, error: "uuid must be provided." };
  }
  try {
    logger.info(`Retrieving department for ${uuid}`);
    const department = await getRetrieveDepartmentByUuidGateway()(uuid);
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
