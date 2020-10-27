import moment from "moment";
import logger from "../../logger";

const captureEvent = ({ getDb }) => async ({
  action,
  visitId,
  callSessionId,
}) => {
  const db = await getDb();
  const timestamp = moment().utc().toISOString();

  try {
    const event = await db.one(
      `INSERT INTO events
          (id, time, action, visit_id, session_id)
          VALUES (default, $1, $2, $3, $4)
          RETURNING id`,
      [timestamp, action, visitId, callSessionId]
    );

    return {
      event: {
        id: event.id,
        time: timestamp,
        action: action,
        visitId: visitId,
        callSessionId: callSessionId,
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
