import logger from "../../../logger";
import { COMPLETE } from "../../helpers/visitStatus";

export default ({ getDb }) => async ({ id, wardId }) => {
  logger.info(
    `mark visit as complete id: ${id}, wardId: ${wardId}`,
    id,
    wardId
  );

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
    console.log(error);

    logger.error(error);
    return {
      id: null,
      error: error.toString(),
    };
  }
};
