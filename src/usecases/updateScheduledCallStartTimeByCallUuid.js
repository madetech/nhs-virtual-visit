
export default ({
    getUpdateScheduledCallStartTimeByCallUuidGateway,
    logger
  }) => async (callUuid) => {
    if (callUuid === undefined) {
      return { visit: null, error: "Call uuid must be provided." };
    }
  
    try {
      logger.info(`Updating start time for call uuid: ${callUuid}`);
      const visit = await getUpdateScheduledCallStartTimeByCallUuidGateway()(callUuid);
      if (!visit) {
        throw("Scheduled call does not exist!");
      }
      return { visit, error: null };
    } catch (error) {
      return { visit: null, error: `There was an error updating the visit start time: ${error.toString()}` };
    }
  };