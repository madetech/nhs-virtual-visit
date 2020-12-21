import logger from "../../logger";

const retrieveAllOrganizations = ({ getDb }) => async () => {
  const db = await getDb();
  try {
    const organizations = await db.any(
      `SELECT
        id as id,
        name as name
      FROM
        organization_list`
    );

    return {
      organizations: organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
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

export default retrieveAllOrganizations;
