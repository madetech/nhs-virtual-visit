export default ({ getRetrieveHospitalWardVisitTotalsGateway }) => async (hospitalId) => {
  const { wards, sortedByTotalVisitsDescending } = getRetrieveHospitalWardVisitTotalsGateway()(hospitalId);

  const mostVisitedWard = sortedByTotalVisitsDescending[0];
  const leastVisitedWard =
    sortedByTotalVisitsDescending[sortedByTotalVisitsDescending.length - 1];

  const mostVisited = mostVisitedWard
    ? {
        wardName: mostVisitedWard.ward_name,
        totalVisits: parseInt(mostVisitedWard.total_visits),
      }
    : { wardName: "", totalVisits: 0 };

  const leastVisited = leastVisitedWard
    ? {
        wardName: leastVisitedWard.ward_name,
        totalVisits: parseInt(leastVisitedWard.total_visits),
      }
    : { wardName: "", totalVisits: 0 };

  return { wards, mostVisited, leastVisited };
};
