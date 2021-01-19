const retrieveHospitalVisitTotals = ({
  getRetrieveHospitalVisitTotalsGateway,
}) => async (trustId) => {
  try {
    var hospitals = await getRetrieveHospitalVisitTotalsGateway()(trustId);

    const usageListitemCount = 3;
    const mostVisited = hospitals.slice(0, usageListitemCount);
    const leastVisited = hospitals.slice(-usageListitemCount).reverse();

    return { hospitals, mostVisited, leastVisited, error: null };
  } catch (error) {
    return {
      hospitals: null,
      mostVisited: null,
      leastVisited: null,
      error: "There has been error retrieving hospital visit totals",
    };
  }
};

export default retrieveHospitalVisitTotals;
