const updateOrganisationGateway = ({ getMsSqlConnPool, logger }) => async ({
  id,
  name,
}) => {
  logger.info(`Updating organisation ${id}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("id", id)
      .input("name", name)
      .query(
        `UPDATE dbo.[organisation] SET name = @name OUTPUT inserted.id, inserted.name WHERE id = @id`
      );
    if (response.recordset.length > 0) {
      logger.info(`${id} has been updated`);

      return {
        organisation: response.recordset[0],
        error: null,
      };
    }

    logger.error(`Error: ${id} could not be found in the database`);
    return {
      organisation: null,
      error: "The organisation could not be found in the database",
    };
  } catch (error) {
    logger.error(`Error updating organisation ${id}: ${error}`);
    return {
      organisation: null,
      error: error.toString(),
    };
  }
};

export default updateOrganisationGateway;
