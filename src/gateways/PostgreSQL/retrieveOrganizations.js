import logger from "../../../logger";

const retrieveOrganizations = ({ getDb }) => async () => {
  try {
    const db = await getDb();
    const organizations = await db.any(
      `SELECT
        id as id,
        name as name,
        status as status
      FROM
        organization`
    );

    return {
      organizations: organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
        status: organization.status,
      })),
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      orgznizations: null,
      error: error.toString(),
    };
  }
};

export default retrieveOrganizations;
