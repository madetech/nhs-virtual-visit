import logger from "../../logger";

export default ({ getUpdateDepartmentByIdGateway }) => async ({
  id,
  status,
  name,
}) => {
  if (id === undefined) {
    return { uuid: null, error: "id must be provided." };
  }
  if (status === undefined) {
    return { uuid: null, error: "status must be provided." };
  }

  if (name === undefined) {
    return { uuid: null, error: "department name must be provided." };
  }

  try {
    logger.info(`Updating department  ${name} with ${id}`);
    const returnedUuid = await getUpdateDepartmentByIdGateway()({
      id,
      status: status == "active" ? 1 : 0,
      name,
    });
    return { uuid: returnedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error updating the department." };
  }
};
