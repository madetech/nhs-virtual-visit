const retrieveAverageParticipantsInVisit = (/*{
  getRetrieveAverageParticipantsInVisitGateway,
}*/) => async (
  trustId
) => {
  if (!trustId) return { error: "A trustId must be provided." };

  return {
    averageParticipantsInVisit: 1.0,
    error: null,
  }; //await getRetrieveAverageParticipantsInVisitGateway()(trustId);
};

export default retrieveAverageParticipantsInVisit;
