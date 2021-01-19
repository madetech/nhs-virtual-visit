const retrieveReportingStartDateByTrustId = ({
  getRetrieveReportingStartDateByTrustIdGateway,
}) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  return await getRetrieveReportingStartDateByTrustIdGateway()(trustId);
};

export default retrieveReportingStartDateByTrustId;
