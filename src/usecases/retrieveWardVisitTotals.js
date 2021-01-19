const calculateTotalNumberOfVisits = (visitsByWard) =>
  visitsByWard.reduce((total, { visits }) => total + visits, 0);

const retrieveWardVisitTotals = ({ getRetrieveWardVisitTotalsGateway }) => async (trustId) => {
  const visitTotals = await getRetrieveWardVisitTotalsGateway()(trustId);
  const overallTotal = calculateTotalNumberOfVisits(visitTotals);

  return { total: overallTotal, byWard: visitTotals };
};

export default retrieveWardVisitTotals;
