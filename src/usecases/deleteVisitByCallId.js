import logger from "../../logger";

const deleteVisitByCallId = ({ getDeleteVisitByCallIdGateway }) => async (
  callId
) => {
  logger.info(`deleting visit for callId ${callId}`, callId);
  return await getDeleteVisitByCallIdGateway()(callId);
};

export default deleteVisitByCallId;
