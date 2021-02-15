import { statusToId, COMPLETE } from "../helpers/visitStatus";

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
    status: statusToId(COMPLETE),
  });
};

export default markVisitAsComplete;
