import logger from "../../logger";

export default ({ getDb }) => async ({
  name,
  id,
  status,
  supportUrl = null,
  surveyUrl = null,
}) => {
  const db = await getDb();

  try {
    const updatedHospital = await db.one(
      `UPDATE hospitals
      SET name = $1, support_url = $3, survey_url = $4, status = $5
      WHERE
        id = $2
      RETURNING id
			`,
      [name, id, supportUrl, surveyUrl, status]
    );
    return {
      id: updatedHospital.id,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      id: null,
      error: error.toString(),
    };
  }
};
