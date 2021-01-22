import logger from "../../../logger";

const activateManagerAndOrganisationGateway = ({ getMsSqlConnPool }) => async ({
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
              WHERE id = @userId;
            UPDATE dbo.[user_verification] 
              SET verified = @verified 
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

    return {
      organisation: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error activating manager ${error}`);
    return {
      user: null,
      error: error.toString(),
    };
  }
};

export default activateManagerAndOrganisationGateway;
