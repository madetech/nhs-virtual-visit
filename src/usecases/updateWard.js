import logger from "../../logger";

export default ({ getDb }) => async (ward) => {
  const db = await getDb();
  try {
    const updatedWard = await db.one(
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
    logger.error(error);
    return {
      wardId: null,
      error: error.toString(),
    };
  }
};
