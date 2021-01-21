import logger from "../../../logger";

const retrieveHospitalsByTrustId = ({ getDb }) => async ({
  trustId,
  options = { withWards: false },
}) => {
  logger.info(`Retrieving hospitals by trust ID for ${trustId}`);

  let hospitals = [];
  try {
    hospitals = await getDb().any(
      `SELECT * FROM hospitals WHERE trust_id = $1`,
      trustId
    );

    hospitals = hospitals.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      status: row.status,
      surveyUrl: row.survey_url,
      supportUrl: row.support_url,
    }));

    if (options.withWards) {
      hospitals = await Promise.all(
        hospitals.map(async (hospital) => {
          const wards = await getDb().any(
            `SELECT * FROM wards WHERE hospital_id = $1 AND archived_at IS NULL`,
            hospital.id
          );

          return {
            id: hospital.id,
            name: hospital.name,
            code: hospital.code,
            status: hospital.status,
            surveyUrl: hospital.surveyUrl,
            supportUrl: hospital.supportUrl,
            wards: wards.map((ward) => ({ id: ward.id, name: ward.name })),
          };
        })
      );
    }

    return {
      hospitals: hospitals,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      hospitals: [],
      error: error.message.toString(),
    };
  }
};

export default retrieveHospitalsByTrustId;
