import logger from "../../../logger";
import moment from "moment";

const retrieveScheduledCalls = ({ getMsSqlConnPool }) => async () => {
  logger.info("Retrieving scheduled calls for pii clear out");

  try {
    const db = await getMsSqlConnPool();
    const timestamp = moment().utc().toISOString();
    const response = await db
      .request()
      .input("callTime", timestamp)
      .query(
        `SELECT * 
          FROM dbo.[scheduled_calls]
          WHERE call_time  <= @callTime
        `
      );

    console.log(response.recordset);
    return {
      calls: response.recordset,
      error: null
    }
  } catch (error) {
    logger.error("There was an error retrieving scheduled call for pii clear out");
    return {
      calls: null,
      error: error.toString(),
    };
  }
};

export default retrieveScheduledCalls;
