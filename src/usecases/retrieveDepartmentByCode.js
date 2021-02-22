import logger from "../../logger";

export default ({ getRetrieveDepartmentByCodeGateway }) => async (wardCode, pin) => {
  try {
    logger.info(`Verify ward login for wardcode ${wardCode}`);
    const department = await getRetrieveDepartmentByCodeGateway()(wardCode, pin);

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
