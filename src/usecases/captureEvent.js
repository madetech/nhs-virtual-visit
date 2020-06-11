import moment from "moment";

const captureEvent = ({ getDb }) => async ({ action, visitId, sessionId }) => {
  const db = await getDb();
  const timestamp = moment().toISOString();

  try {
    const captureEvent = await db.one(
      `INSERT INTO events
          (id, time, action, visit_id, session_id)
          VALUES (default, $1, $2, $3, $4)
          RETURNING id`,
      [timestamp, action, visitId, sessionId]
    );

    return {
      event: {
        id: captureEvent.id,
        time: timestamp,
        action: action,
        visitId: visitId,
        sessionId: sessionId,
      },
      error: null,
    };
  } catch (err) {
    const message = `Failed to add ${action} event for visit ${visitId}`;
    console.error(message, err);
    return { event: null, error: message };
  }
};

export default captureEvent;
