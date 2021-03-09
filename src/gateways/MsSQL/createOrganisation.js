const createOrganisationGateway = ({ getMsSqlConnPool, logger }) => async ({
  name,
  type,
  createdBy,
}) => {
  logger.info(`Creating organisation ${name}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("name", name)
      .input("type", type)
      .input("createdBy", createdBy)
      .query(
        "INSERT INTO dbo.[organisation] ([name], [type], [created_by]) OUTPUT inserted.* VALUES (@name, @type, @createdBy)"
      );
    logger.info(response.recordset[0]);
    return {
      organisation: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error creating organisation ${name}, ${error}`);
    return {
      organisation: null,
      error: error.toString(),
    };
  }
};

export default createOrganisationGateway;
