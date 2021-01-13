import logger from "../../logger";

const createWard = ({ getCreateWardGateway }) => async (ward) => {
  logger.info(`Creating ward for ${JSON.stringify(ward)}`, ward);

  const { wardId, error } = await getCreateWardGateway()({
    ward: {
      name: ward.name,
      code: ward.code,
      trustId: ward.trustId,
      hospitalId: ward.hospitalId,
      pin: ward.pin,
    },
  });

  return {
    wardId: wardId,
    error: error,
  };
};

export default createWard;
