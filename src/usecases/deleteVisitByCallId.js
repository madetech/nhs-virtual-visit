const deleteVisitByCallId = ({ getDeleteVisitByCallIdGateway }) => async (
  callId
) => {
  return await getDeleteVisitByCallIdGateway()(callId);
};

export default deleteVisitByCallId;
