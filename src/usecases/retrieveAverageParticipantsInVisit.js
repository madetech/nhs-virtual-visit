const retrieveAverageParticipantsInVisit = ({
  getRetrieveAverageParticipantsInVisitGateway,
}) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  return await getRetrieveAverageParticipantsInVisitGateway()(trustId);
};

export default retrieveAverageParticipantsInVisit;
