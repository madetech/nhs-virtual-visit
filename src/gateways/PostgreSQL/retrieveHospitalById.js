import logger from "../../../logger";

const retrieveHospitalById = ({ getDb }) => async ({ hospitalId, trustId }) => {
  logger.info(`Retrieving hospital for ${hospitalId}`);

  try {
    const hospital = await getDb().oneOrNone(
      "SELECT * FROM hospitals WHERE id = $1 AND trust_id = $2 LIMIT 1",
      [hospitalId, trustId]
    );

    if (!hospital) throw "Hospital not found for id";

    return {
      hospital: {
        id: hospital.id,
        name: hospital.name,
        code: hospital.code,
        status: hospital.status,
        supportUrl: hospital.support_url,
        surveyUrl: hospital.survey_url,
      },
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving hospital: ${error}`);

    return {
      hospital: null,
      error: error.toString(),
    };
  }
};

export default retrieveHospitalById;
