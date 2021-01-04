import logger from "../../logger";

const verifyWardCode = ({ getFindWardByCodeGateway }) => async (wardCode) => {
  const findWardByCodeGateway = await getFindWardByCodeGateway();
  try {
    const ward = await findWardByCodeGateway(wardCode);

    if (ward) {
      return {
        validWardCode: true,
        ward: { id: ward.wardId, code: ward.wardCode, trustId: ward.trustId },
        error: null,
      };
    } else {
      return { validWardCode: false, error: null };
    }
  } catch (error) {
    logger.error(JSON.stringify(error));

    return {
      validWardCode: false,
      error: error.toString(),
    };
  }
};

export default verifyWardCode;
