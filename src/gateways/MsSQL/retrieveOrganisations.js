import logger from "../../../logger";

const retrieveOrganisationsGateway = ({ getMsSqlConnPool }) => async ({
  page,
  limit,
}) => {
  logger.info("Retrieving all organisations");

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("offset", (limit || 50) * (page || 0))
      .input("limit", limit || 50)
      .query(
        "SELECT * FROM dbo.[organisation] ORDER BY [name] OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY"
      );

    const count = await db
      .request()
      .query("SELECT total = COUNT(*) from dbo.[organisation]");

    return {
      organisations: response.recordset,
      total: count.recordset[0].total,
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
