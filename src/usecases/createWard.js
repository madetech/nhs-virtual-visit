import logger from "../../logger";

const createWard = ({ getDb }) => async (ward) => {
  const db = await getDb();
  try {
    logger.info(`Creating ward for ${JSON.stringify(ward)}`, ward);
    const createdWard = await db.one(
      `INSERT INTO wards
        (id, name, code, trust_id, hospital_id, pin)
        VALUES (default, $1, $2, $3, $4, $5)
        RETURNING id
      `,
      [ward.name, ward.code, ward.trustId, ward.hospitalId, ward.pin]
    );

    return {
      wardId: createdWard.id,
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

export default createWard;
