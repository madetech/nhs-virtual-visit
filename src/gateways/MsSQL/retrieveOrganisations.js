import logger from "../../../logger";

const retrieveOrganisationsGateway = ({ getMsSqlConnPool }) => async () => {
  logger.info("Retrieving all organisations");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .query("SELECT * FROM dbo.[organisation]");

    return {
      organisations: response.recordset,
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving all organisations from database ${error}`);
    return {
      organisations: null,
      error: error.toString(),
    };
  }
};

export default retrieveOrganisationsGateway;
