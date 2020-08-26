import logger from "../../logger";

const retrieveTrustById = ({ getDb }) => async (trustId) => {
  const db = await getDb();
  logger.info(`Retrieving trust for ${trustId}`);
  try {
    const trust = await db.oneOrNone(
      "SELECT * FROM trusts WHERE id = $1 LIMIT 1",
      trustId
    );

    return {
      trust: {
        id: trust.id,
        name: trust.name,
        videoProvider: trust.video_provider,
      },
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      trust: null,
      error: error.toString(),
    };
  }
};

export default retrieveTrustById;
