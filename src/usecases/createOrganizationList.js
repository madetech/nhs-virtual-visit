import logger from "../../logger";

const createOrganizationList = ({ getDb }) => async ({ name }) => {
  const db = await getDb();

  try {
    logger.info(`Adding organization ${name} to list`, name);

    const addedOrganization = await db.one(
      `INSERT INTO organization_list
        (id, name)
        VALUES (default, $1)
        RETURNING id
      `,
      [name]
    );

    return {
      organizationId: addedOrganization.id,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      organizationId: null,
      error: error.toString(),
    };
  }
};

export default createOrganizationList;
