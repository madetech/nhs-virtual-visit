import logger from "../../logger";
import { COMPLETE } from "../helpers/visitStatus";

const markVisitAsComplete = ({ getDb }) => async ({ id, wardId }) => {
  if (!id) {
    return { id: null, error: "An id must be provided." };
  }
  if (!wardId) {
    return { id: null, error: "A wardId must be provided." };
  }

  const db = await getDb();

  try {
    const updatedVisit = await db.one(
      `UPDATE scheduled_calls_table
      SET status = $1
      WHERE
        id = $2
      RETURNING id
			`,
      [COMPLETE, id]
    );
    return {
      id: updatedVisit.id,
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      id: null,
      error: error.toString(),
    };
  }
};

export default markVisitAsComplete;
