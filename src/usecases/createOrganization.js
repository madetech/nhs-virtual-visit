import logger from "../../logger";

const createOrganization = ({ getDb }) => async ({ name, status }) => {
  const db = await getDb();

  try {
    logger.info(`Adding organization ${name} to list`, name);

    const addedOrganization = await db.one(
      `INSERT INTO organization
        (id, name, status)
        VALUES (default, $1, $2)
        RETURNING id
      `,
      [name, status]
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

export default createOrganization;
