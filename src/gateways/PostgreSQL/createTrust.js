import logger from "../../../logger";

const createTrust = ({ getDb }) => async ({
  name,
  adminCode,
  hashedPassword,
  videoProvider,
}) => {
  logger.info(`Creating trust ${name}`);

  try {
    const createdTrust = await getDb().one(
      `INSERT INTO trusts
       (id, name, admin_code, password, video_provider)
       VALUES (default, $1, $2, $3, $4)
       RETURNING id
      `,
      [name, adminCode, hashedPassword, videoProvider]
    );

    return {
      trustId: createdTrust.id,
      error: null,
    };
  } catch (error) {
    logger.error(`Error creating trust ${error}`);

    return {
      trustId: null,
      error: error.toString(),
    };
  }
};

export default createTrust;
