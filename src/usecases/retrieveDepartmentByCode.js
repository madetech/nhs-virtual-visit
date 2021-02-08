import logger from "../../logger";

export default ({ getRetrieveDepartmentByCodeGateway }) => async (wardCode) => {
  try {
    const department = await getRetrieveDepartmentByCodeGateway()(wardCode);

    if (department) {
      return {
        validWardCode: true,
        department,
        error: null,
      };
    } else {
      return { validWardCode: false, error: null };
    }
  } catch (error) {
    logger.error(JSON.stringify(error));

    return {
      validWardCode: false,
      error: error.toString(),
    };
  }
};
