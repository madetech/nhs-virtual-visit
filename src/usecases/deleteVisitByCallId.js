const deleteVisitByCallId = ({ getDeleteVisitByCallIdGW }) => async (
  callId
) => {
  if (!callId) {
    return {
      success: false,
      error: "callId is not defined",
    };
  }

  const { success, error } = await getDeleteVisitByCallIdGW()(callId);

  return { success, error };
};

export default deleteVisitByCallId;
