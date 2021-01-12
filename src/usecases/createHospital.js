import logger from "../../logger";

const createHospital = ({ getInsertHospitalGateway }) => async ({
  name,
  trustId,
  code,
  supportUrl = null,
  surveyUrl = null,
}) => {
  logger.info({
    message: `Creating hospital for ${name}, trust: ${trustId}`,
    meta: {
      name: name,
      code: code,
      trustId: trustId,
    },
  });

  const { hospitalId, error } = await getInsertHospitalGateway()({
    name,
    trustId,
    code,
    supportUrl,
    surveyUrl,
  });

  return {
    hospitalId: hospitalId,
    error: error,
  };
};

export default createHospital;
