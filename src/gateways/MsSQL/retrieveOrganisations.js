const retrieveOrganisationsGateway = ({ getMsSqlConnPool, logger }) => async ({
  page,
  limit,
}) => {
  logger.info("Retrieving all organisations");

  try {
    const db = await getMsSqlConnPool();
    const count = await db
      .request()
      .query("SELECT total = COUNT(*) from dbo.[organisation]");

    const total = count.recordset[0].total;

    const response = await db
      .request()
      .input("offset", (limit || 50) * (page || 0))
      .input("limit", limit || total)
      .query(
        "SELECT * FROM dbo.[organisation] ORDER BY [name] OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY"
      );

    return {
      organisations: response.recordset,
      total: total,
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
