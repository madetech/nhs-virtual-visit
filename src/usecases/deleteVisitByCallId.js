const deleteVisitByCallId = ({ getDeleteVisitByCallIdGateway }) => async (
  callId
) => {
  if (!callId) {
    return {
      success: false,
      error: "callId is not defined",
    };
  }

  const { success, error } = await getDeleteVisitByCallIdGateway()(callId);

  return { success, error };
};

export default deleteVisitByCallId;
