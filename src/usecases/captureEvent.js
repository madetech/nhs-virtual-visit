const captureEvent = ({ getCaptureEventGateway, logger }) => async ({
  action,
  visitId,
  callSessionId,
}) => {
  logger.info(
    `Capture events action ${action}, visitId ${visitId}, callSessionId ${callSessionId}`
  );

  return await getCaptureEventGateway()({
    action,
    visitId,
    callSessionId,
  });
};

export default captureEvent;
