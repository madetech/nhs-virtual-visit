import logger from "../../logger";

export default ({ getArchiveDepartmentByIdGateway }) => async (id) => {
  if (id === undefined) {
    return { uuid: null, error: "id must be provided." };
  }
  try {
    logger.info(`Archiving deparment for ${id}`);
    const archivedUuid = await getArchiveDepartmentByIdGateway()(id);
    console.log(archivedUuid);
    return { uuid: archivedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error archiving a department." };
  }
};
