export default ({ getRetrieveVisitByCallId }) => async (callId, password) => {
  const retrieveVisitByCallId = await getRetrieveVisitByCallId();

  const { scheduledCall, error } = await retrieveVisitByCallId(callId);

  if (error) {
    return {
      validCallPassword: false,
      error,
    };
  }

  const dbPassword = scheduledCall.callPassword;

  return {
    validCallPassword: dbPassword === "" || dbPassword === password,
    error: null,
  };
};
