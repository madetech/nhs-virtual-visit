export default ({ getRetrieveVisitByCallIdGateway }) => async (callId) => {
  return await getRetrieveVisitByCallIdGateway()(callId);
};
