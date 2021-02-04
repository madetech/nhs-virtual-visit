import logger from "../../../logger";
import formatDate from "../../helpers/formatDatesAndTimes";

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
      .query();
    const date = response.recordset[0].startDate;
    return {
      startDate: formatDate(date),
      error: null,
    };
  } catch (error) {
    logger.error(
      `Error retrieving reporting start date for organisation id: ${organisationId}`
    );
    return {
      startDate: null,
      error: error.toString(),
    };
  }
};

export default retrieveReportingStartDateByOrganisationIdGateway;
