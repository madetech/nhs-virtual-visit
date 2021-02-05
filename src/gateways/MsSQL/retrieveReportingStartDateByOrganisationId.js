import logger from "../../../logger";
// import formatDate from "../../helpers/formatDatesAndTimes";

const retrieveReportingStartDateByOrganisationIdGateway = ({
  getMsSqlConnPool,
}) => async (organisationId) => {
  logger.info(
    `Retrieving reporting start date for organisation id: ${organisationId}`
  );

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("organisationId", organisationId)
      .query(
        `SELECT dbo.[events].created_at
          FROM dbo.[events]
          LEFT JOIN dbo.[scheduled_call] ON dbo.[events].scheduled_call_id = dbo.[scheduled_call].id
          LEFT JOIN dbo.[department] ON dbo.[scheduled_call].department_id = dbo.[department].id
          LEFT JOIN dbo.[facility] ON dbo.[department].facility_id = dbo.[facility].id
          LEFT JOIN dbo.[organisation] ON dbo.[facility].organisation_id = dbo.[organisation].id 
          WHERE organisation_id = @organisationId`
      );
    return {
      response,
      error: null,
    };
    // const date = response.recordset[0].startDate;
    // return {
    //   startDate: formatDate(date),
    //   error: null,
    // };
  } catch (error) {
    logger.error(
      `Error retrieving reporting start date for organisation id: ${organisationId}`
    );
    return {
      response: null,
      error: error.toString(),
    };
    // return {
    //   startDate: null,
    //   error: error.toString(),
    // };
  }
};

export default retrieveReportingStartDateByOrganisationIdGateway;
