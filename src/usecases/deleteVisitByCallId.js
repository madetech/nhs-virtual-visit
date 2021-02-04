const deleteVisitByCallId = ({ getDeleteVisitByCallIdGW }) => async (
  callId
) => {
  return await getDeleteVisitByCallIdGW()(callId);
};

export default deleteVisitByCallId;
