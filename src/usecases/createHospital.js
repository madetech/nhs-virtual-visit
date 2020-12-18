import logger from "../../logger";

const createHospital = ({ getDb }) => async ({
  name,
  trustId,
  code,
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
          (id, name, trust_id, support_url, survey_url, code)
          VALUES (default, $1, $2, $3, $4, $5)
          RETURNING id
        `,
      [name, trustId, supportUrl, surveyUrl, code]
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
