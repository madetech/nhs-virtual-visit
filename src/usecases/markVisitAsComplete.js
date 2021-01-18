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

  return await getMarkVisitAsCompleteGateway()({ id, wardId });
};

export default markVisitAsComplete;
