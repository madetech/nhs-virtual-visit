import logger from "../../logger";
import Database from "./Database";

const retrieveTrustById = async (trustId) => {
  const db = await Database.getInstance();

  logger.info(`Retrieving trust for ${trustId}`);
  try {
    if (!trustId) throw "Attempting to retrieve trust with no trust Id set";
    const trust = await db.oneOrNone(
      "SELECT * FROM organization_list WHERE id = $1 LIMIT 1",
      trustId
    );

    if (!trust) throw " for id";

    return {
      trust: {
        id: trust.id,
        name: trust.name,
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
