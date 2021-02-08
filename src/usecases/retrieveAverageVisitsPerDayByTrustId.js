const retrieveAverageVisitsPerDay = (/*{
  getRetrieveAverageVisitsPerDayGateway,
}*/) => async (
  trustId /*, endDate*/
) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const average = 1; /*await getRetrieveAverageVisitsPerDayGateway()(
    trustId,
    endDate
  );*/

  return {
    averageVisitsPerDay: average,
    error: null,
  };
};

export default retrieveAverageVisitsPerDay;
