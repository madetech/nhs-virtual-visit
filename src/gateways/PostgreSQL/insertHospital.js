import logger from "../../../logger";

const insertHospitalQuery = async (
  db,
  name,
  trustId,
  supportUrl,
  surveyUrl,
  code
) =>
  await db.one(
    `INSERT INTO hospitals (id, name, trust_id, support_url, survey_url, code)
     VALUES (default, $1, $2, $3, $4, $5)
     RETURNING id
    `,
    [name, trustId, supportUrl, surveyUrl, code]
  );

export default ({ getDb }) => async ({
  name,
  trustId,
  code,
  supportUrl = null,
  surveyUrl = null,
}) => {
  try {
    const createdHospital = await insertHospitalQuery(
      getDb(),
      name,
      trustId,
      supportUrl,
      surveyUrl,
      code
    );

    return {
      hospitalId: createdHospital.id,
      error: null,
    };
  } catch (error) {
    logger.error(`Error creating hospital: ${error}`);

    return {
      hospitalId: null,
      error: error.toString(),
    };
  }
};
