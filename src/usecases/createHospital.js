import logger from "../../logger";

const createHospital = ({ getDb }) => async ({
  name,
  trustId,
  supportUrl = null,
  surveyUrl = null,
}) => {
  const db = await getDb();

  try {
    logger.info(
      `Creating hospital for ${name}, trust: ${trustId}`,
      name,
      trustId
    );
    const createdHospital = await db.one(
      `INSERT INTO hospitals
          (id, name, trust_id, support_url, survey_url)
          VALUES (default, $1, $2, $3, $4)
          RETURNING id
        `,
      [name, trustId, supportUrl, surveyUrl]
    );

    return {
      hospitalId: createdHospital.id,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      hospitalId: null,
      error: error.toString(),
    };
  }
};

export default createHospital;
