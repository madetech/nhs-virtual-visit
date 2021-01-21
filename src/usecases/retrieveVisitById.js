const retrieveVisitById = ({ getRetrieveVisitByIdGateway }) => async ({
  id,
  wardId,
}) => {
  if (!id) {
    return { scheduledCall: null, error: "An id must be provided." };
  }
  if (!wardId) {
    return { scheduledCall: null, error: "A wardId must be provided." };
  }

  return await getRetrieveVisitByIdGateway()({ id, wardId });
};

export default retrieveVisitById;
