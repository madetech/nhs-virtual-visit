import logger from "../../../logger";

const retrieveAverageParticipantsInVisitGateway = ({
  getMsSqlConnPool,
}) => async (organisationId) => {
  logger.info(`Retrieving average participants in visit for ${organisationId}`);
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("organisationId", organisationId)
      .query(
        `SELECT to_char(COALESCE(AVG(participants), 0) '999D9') as average_participants
          FROM (SELECT COUNT (DISTINCT session_id) AS participants
            FROM events
            LEFT JOIN dbo.[scheduled_calls] ON events.visit_id = dbo.[scheduled_calls].id
            LEFT JOIN dbo.[department] ON dbo.[scheduled_calls].ward_id = wards.id
            LEFT JOIN dbo.[organisations] ON dbo.[department].trust_id = trust.id
            WHERE dbo.[organisations].id = @organisationId
            GROUP BY events.visit_id) distinct_session_counts_per visit`
      );
    console.log(response);
    return {
      averageParticipantsInVisit: response.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(
      `There is an error retrieveing average participants in visit for ${organisationId}`
    );
    return {
      averageParticipantsInVisit: null,
      error: error.toString(),
    };
  }
};

export default retrieveAverageParticipantsInVisitGateway;
