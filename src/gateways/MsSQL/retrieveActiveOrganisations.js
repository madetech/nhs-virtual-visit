import logger from "../../../logger";

const retrieveActiveOrganisationsGateway = ({
  getMsSqlConnPool,
}) => async () => {
  logger.info("Retrieving active organisations");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("status", 1)
      .query("SELECT * FROM dbo.[organisation] WHERE STATUS = @status");

    return {
      organisations: response.recordset,
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error retrieving active organisations from database ${error}`
    );
    return {
      organisations: null,
      error: error.toString(),
    };
  }
};

export default retrieveActiveOrganisationsGateway;
