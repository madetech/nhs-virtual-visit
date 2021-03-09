const retrieveTrusts = ({ getRetrieveTrustsGateway, logger }) => async () => {
  try {
    const trusts = await getRetrieveTrustsGateway()();

    return {
      trusts,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      trusts: null,
      error: error.toString(),
    };
  }
};

export default retrieveTrusts;
