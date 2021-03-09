const retrieveWards = ({ getRetrieveActiveWardsByTrustIdGW, logger }) => async (
  trustId
) => {
  const retrieveActiveWardsByTrustIdGW = getRetrieveActiveWardsByTrustIdGW();
  try {
    const wards = await retrieveActiveWardsByTrustIdGW(trustId);

    return {
      wards: wards.map(({ wardId, wardName, hospitalName, wardCode }) => ({
        id: wardId,
        name: wardName,
        hospitalName: hospitalName,
        code: wardCode,
      })),
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      wards: null,
      error: error.toString(),
    };
  }
};

export default retrieveWards;
