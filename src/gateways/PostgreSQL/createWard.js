import logger from "../../../logger";

const createWard = ({ getDb }) => async ({ ward }) => {
  logger.info(`Creating ward for ${JSON.stringify(ward)}`, ward);

  try {
    const createdWard = await getDb().one(
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
    logger.error(`Error creating ward ${error}`);

    return {
      wardId: null,
      error: error.toString(),
    };
  }
};

export default createWard;
