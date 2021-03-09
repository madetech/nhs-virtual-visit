export default ({ getUpdateDepartmentByIdGateway, logger }) => async ({ id, name, pin }) => {
  if (id === undefined) {
    return { uuid: null, error: "id must be provided." };
  }
  if (name === undefined) {
    return { uuid: null, error: "department name must be provided." };
  }
  let args = {  id, name }
  if (pin) {
    args = { ...args, pin }
  }
  try {
    logger.info(`Updating department  ${name} with ${id}`);
    const returnedUuid = await getUpdateDepartmentByIdGateway()(args);
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error updating the department." };
  }
};
