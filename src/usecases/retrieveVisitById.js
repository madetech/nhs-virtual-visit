const retrieveVisitById = ({ getRetrieveVisitByIdGateway }) => async ({
  id,
  departmentId,
}) => {
  if (!id) {
    return { scheduledCall: null, error: "An id must be provided." };
  }
  if (!departmentId) {
    return { scheduledCall: null, error: "A departmentId must be provided." };
  }

  return await getRetrieveVisitByIdGateway()({ callId: id, departmentId });
};

export default retrieveVisitById;
