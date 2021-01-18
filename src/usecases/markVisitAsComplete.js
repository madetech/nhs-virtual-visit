import logger from "../../logger";

const markVisitAsComplete = ({ getMarkVisitAsCompleteGateway }) => async ({
  id,
  wardId,
}) => {
  if (!id) {
    return { id: null, error: "An id must be provided." };
  }
  if (!wardId) {
    return { id: null, error: "A wardId must be provided." };
  }

  logger.info(
    `mark visit as complete id: ${id}, wardId: ${wardId}`,
    id,
    wardId
  );
  return await getMarkVisitAsCompleteGateway()(id, wardId);
};

export default markVisitAsComplete;
