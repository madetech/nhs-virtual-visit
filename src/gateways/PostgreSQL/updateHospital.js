import logger from "../../../logger";

const updateHospitalQuery = async (
  db,
  name,
  id,
  supportUrl,
  surveyUrl,
  status
) =>
  await db.one(
    `UPDATE hospitals
     SET name = $1, support_url = $3, survey_url = $4, status = $5
     WHERE
       id = $2
     RETURNING id
    `,
    [name, id, supportUrl, surveyUrl, status]
  );

export default ({ getDb }) => async ({
  name,
  id,
  status,
  supportUrl = null,
  surveyUrl = null,
}) => {
  try {
    const updatedHospital = await updateHospitalQuery(
      getDb(),
      name,
      id,
      supportUrl,
      surveyUrl,
      status
    );

    return {
      hospitalId: updatedHospital.id,
      error: null,
    };
  } catch (error) {
    logger.error(`Error updating hospital: ${error}`);

    return {
      hospitalId: null,
      error: error.toString(),
    };
  }
};
