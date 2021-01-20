import formatDate from "../helpers/formatDatesAndTimes";

export default({ getRetrieveWardVisitTotalsStartDateByTrustIdGateway }) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const { startDate, error } = await getRetrieveWardVisitTotalsStartDateByTrustIdGateway()(trustId);

  return {
    startDate: startDate !== null ? formatDate(startDate) : null,
    error
  }
};