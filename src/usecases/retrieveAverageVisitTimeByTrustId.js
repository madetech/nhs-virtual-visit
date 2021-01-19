import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

export default ({ getRetrieveAverageVisitTimeByTrustIdGateway }) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const averageVisitTimeSeconds = await getRetrieveAverageVisitTimeByTrustIdGateway()(trustId);

  const averageVisitTime = moment
    .duration(averageVisitTimeSeconds, "seconds")
    .format("h [hr], m [min]");

  return {
    averageVisitTimeSeconds,
    averageVisitTime,
    error: null,
  };
};