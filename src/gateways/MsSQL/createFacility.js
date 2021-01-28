import logger from "../../../logger";

export default ({ getMsSqlConnPool }) => async ({
  name,
  organisationId,
  createdBy,
  code,
  status,
}) => {
  logger.info(`Creating facility ${name}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("name", name)
      .input("organisationId", organisationId)
      .input("createdBy", createdBy)
      .input("code", code)
      .input("status", status)
      .query(
        "INSERT INTO dbo.[facility] ([name], [organisation_id], [created_by], [code], [status] ) OUTPUT inserted.* VALUES (@name, @organisationId, @createdBy, @code, @status)"
      );
    logger.info(response.recordset[0]);
    return {
      facility: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error creating organisation ${name}, ${error}`);
    return {
      facility: null,
      error: error.toString(),
    };
  }
};
