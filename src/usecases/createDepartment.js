import logger from "../../logger";

export default ({ getCreateDepartment }) => async (department) => {
  const { name, code, facilityId, pin, createdBy } = department;
  if (name === undefined) {
    return { uuid: null, error: "name must be provided." };
  }
  if (code === undefined) {
    return { code: null, error: "code must be provided." };
  }
  if (facilityId === undefined) {
    return { uuid: null, error: "facility id must be provided." };
  }
  if (pin === undefined) {
    return { uuid: null, error: "pin must be provided." };
  }
  if (createdBy === undefined) {
    return { uuid: null, error: "user id must be provided." };
  }
  try {
    logger.info(`Creating department for facility ${facilityId}`);

    const uuid = await getCreateDepartment()(department);
    return { uuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error creating a department." };
  }
};
