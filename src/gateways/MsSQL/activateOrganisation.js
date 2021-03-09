const activateOrganisationGateway = ({ getMsSqlConnPool, logger }) => async ({
  organisationId,
  status,
}) => {
  logger.info(`Activating organisation ${organisationId}`);
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("organisationId", organisationId)
      .input("status", status)
      .query(
        `UPDATE dbo.[organisation] 
          SET status = @status 
          OUTPUT inserted.*
          WHERE id = @organisationId`
      );
    if (!response.recordset[0]) {
      throw "Error activating organisation";
    }
    return {
      organisation: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error activating organisation ${organisationId}, ${error}`);
    return {
      organisation: null,
      error: error.toString(),
    };
  }
};

export default activateOrganisationGateway;
