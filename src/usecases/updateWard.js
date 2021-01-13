import logger from "../../logger";

export default ({ getUpdateWardGateway }) => async (ward) => {
  logger.info(`Creating ward for ${JSON.stringify(ward)}`, ward);

  const { wardId, error } = await getUpdateWardGateway()({
    ward: {
      name: ward.name,
      hospitalId: ward.hospitalId,
      status: ward.status,
      id: ward.id,
    },
  });

  return {
    wardId: wardId,
    error: error,
  };
};
