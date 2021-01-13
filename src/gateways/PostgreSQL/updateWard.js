import logger from "../../../logger";

export default ({ getDb }) => async ({ ward }) => {
  logger.info(`Updating ward ${ward.id}`);

  try {
    const updatedWard = await getDb().one(
      `UPDATE wards
       SET name = $1,
         hospital_id = $2,
         status = $3
       WHERE
         id = $4
       RETURNING id
      `,
      [ward.name, ward.hospitalId, ward.status, ward.id]
    );
    return {
      wardId: updatedWard.id,
      error: null,
    };
  } catch (error) {
    logger.error(`Error updating ward ${error}`);

    return {
      wardId: null,
      error: error.toString(),
    };
  }
};
