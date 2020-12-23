import logger from "../../logger";
import Database from "./Database";

const retrieveOrganizationById = async (organizationId) => {
  const db = await Database.getInstance();

  logger.info(`Retrieving organization for ${organizationId}`);
  try {
    if (!organizationId)
      throw "Attempting to retrieve trust with no trust Id set";
    const organization = await db.oneOrNone(
      "SELECT * FROM organization WHERE id = $1 LIMIT 1",
      organizationId
    );

    if (!organization) throw "Trust not found for id";

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        status: organization.status,
      },
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      organization: null,
      error: error.toString(),
    };
  }
};

export default retrieveOrganizationById;
