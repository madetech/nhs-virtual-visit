import { statusToId, ACTIVE } from "../../helpers/statusTypes";

const retrieveActiveOrganisationsGateway = ({
  getMsSqlConnPool,
  logger
}) => async () => {
  logger.info("Retrieving active organisations");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("status", statusToId(ACTIVE))
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
