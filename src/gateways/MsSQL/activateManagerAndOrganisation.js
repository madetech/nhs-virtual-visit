const activateManagerAndOrganisationGateway = ({ getMsSqlConnPool, logger }) => async ({
  userId,
  organisationId,
  verified,
  status,
}) => {
  logger.info("Activating manager");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("userId", userId)
      .input("organisationId", organisationId)
      .input("verified", verified)
      .input("status", status)
      .query(
        `BEGIN TRY
          BEGIN TRANSACTION; 
            UPDATE dbo.[user] SET status = @status 
              OUTPUT inserted.*
              WHERE id = @userId;
            UPDATE dbo.[user_verification] 
              SET verified = @verified 
              OUTPUT inserted.*
              WHERE user_id = @userId
            UPDATE dbo.[organisation]
              SET status = @status
              OUTPUT inserted.*
              WHERE id = @organisationId
          COMMIT TRANSACTION;
        END TRY
        BEGIN CATCH
          ROLLBACK
        END CATCH`
      );
    if (
      !response.recordsets[0][0] ||
      !response.recordsets[1][0] ||
      !response.recordsets[2][0]
    ) {
      throw "Error activating organisation and manager";
    }
    return {
      organisation: response.recordsets[2][0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error activating manager ${error}`);
    return {
      organisation: null,
      error: error.toString(),
    };
  }
};

export default activateManagerAndOrganisationGateway;
