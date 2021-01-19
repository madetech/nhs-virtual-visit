const retrieveHospitalVisitTotals = ({
  getRetrieveHospitalVisitTotalsGateway,
}) => async (trustId) => {
  var hospitals = await getRetrieveHospitalVisitTotalsGateway()(trustId);

  const usageListitemCount = 3;
  const mostVisited = hospitals.slice(0, usageListitemCount);
  const leastVisited = hospitals.slice(-usageListitemCount).reverse();

  return { hospitals, mostVisited, leastVisited };
};

export default retrieveHospitalVisitTotals;
