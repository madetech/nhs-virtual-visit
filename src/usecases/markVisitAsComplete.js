import { statusToId, COMPLETED } from "../helpers/visitStatus";

const markVisitAsComplete = ({
  getUpdateVisitStatusByCallIdGateway,
}) => async ({ id, wardId }) => {
  if (!id) {
    return { id: null, error: "An id must be provided." };
  }
  if (!wardId) {
    return { id: null, error: "A wardId must be provided." };
  }

  return await getUpdateVisitStatusByCallIdGateway()({
    id,
    wardId,
    status: statusToId(COMPLETED),
  });
};

export default markVisitAsComplete;
