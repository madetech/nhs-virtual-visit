export default ({ getRetrieveVisitByCallId }) => async (callId, password) => {
  const retrieveVisitByCallId = await getRetrieveVisitByCallId();

  const { visit, error } = await retrieveVisitByCallId(callId);

  if (error) {
    return {
      validCallPassword: false,
      error,
    };
  }

  const dbPassword = visit.callPassword;

  return {
    validCallPassword: dbPassword === "" || dbPassword === password,
    error: null,
  };
};
