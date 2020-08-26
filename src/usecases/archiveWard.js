import moment from "moment";
import { ARCHIVED } from "../../src/helpers/visitStatus";
import logger from "../../logger";

const archiveWard = ({ getRetrieveWardById, getDb }) => async (
  wardId,
  trustId
) => {
  const retrieveWardById = getRetrieveWardById();

  const retrieveResult = await retrieveWardById(wardId, trustId);

  if (!retrieveResult.ward) {
    return { success: false, error: "Ward does not exist" };
  }

  const db = await getDb();

  try {
    await db.result(
      `UPDATE scheduled_calls_table
       SET status = $1
       WHERE ward_id = $2`,
      [ARCHIVED, wardId]
    );
  } catch (err) {
    logger.error(
      `Failed to remove visits [${wardId}] from ward ${trustId}`,
      err
    );
    return { success: false, error: "Failed to remove visits" };
  }

  try {
    await db.result(
      `UPDATE wards
        SET archived_at = $2
        WHERE id = $1
    `,
      [wardId, moment().toISOString()]
    );
  } catch (err) {
    logger.error(
      `Failed to remove ward [${wardId}] from trust ${trustId}`,
      err
    );
    return { success: false, error: "Failed to remove ward" };
  }

  return { success: true, error: null };
};
export default archiveWard;
