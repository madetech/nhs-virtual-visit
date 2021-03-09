import moment from "moment";

const captureEvent = ({ getMsSqlConnPool, logger }) => async ({
  action,
  visitId,
  callSessionId,
}) => {
  try {
    const db = await getMsSqlConnPool();
    const timestamp = moment().utc().toISOString();
    const event = await db
      .request()
      .input("created_at", timestamp)
      .input("action", action)
      .input("scheduled_call_id", visitId)
      .input("session_id", callSessionId)
      .query(
        "INSERT INTO dbo.[events] ([created_at], [action], [scheduled_call_id], [session_id]) OUTPUT inserted.id VALUES (@created_at, @action, @scheduled_call_id, @session_id)"
      );

    return {
      event: {
        id: event.recordset[0].id,
        time: timestamp,
        action,
        visitId,
        callSessionId,
      },
      error: null,
    };
  } catch (err) {
    logger.error(err);
    const message = `Failed to add ${action} event for visit ${visitId}`;
    return { event: null, error: message };
  }
};

export default captureEvent;
