import { statusToId, ARCHIVED } from "../helpers/visitStatus";

export default ({
  getArchiveDepartmentByIdGateway,
  getUpdateVisitStatusByDepartmentIdGateway,
  logger
}) => async (id) => {
  if (id === undefined) {
    return { uuid: null, error: "id must be provided." };
  }
  try {
    logger.info(`Archiving deparment for ${id}`);
    await getUpdateVisitStatusByDepartmentIdGateway()({
      departmentId: id,
      status: statusToId(ARCHIVED),
    });
    const archivedUuid = await getArchiveDepartmentByIdGateway()(id);
    return { uuid: archivedUuid, error: null };
  } catch (error) {
    return { uuid: null, error: "There was an error archiving a department." };
  }
};
