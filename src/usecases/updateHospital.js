import logger from "../../logger";

export default ({ getUpdateHospitalGateway }) => async ({
  name,
  id,
  status,
  supportUrl = null,
  surveyUrl = null,
}) => {
  logger.info({
    message: `Updating hospital for ${name}`,
    meta: {
      name: name,
      id: id,
      status: status,
    },
  });

  const { hospitalId, error } = await getUpdateHospitalGateway()({
    name,
    id,
    supportUrl,
    surveyUrl,
    status,
  });

  return {
    id: hospitalId,
    error: error,
  };
};
