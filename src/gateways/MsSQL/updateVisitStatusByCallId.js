import logger from "../../../logger";
import { idToStatus } from "../../helpers/visitStatus";

export default ({ getMsSqlConnPool }) => async ({
  id,
  departmentId,
  status,
}) => {
  logger.info(
    `updating visit status as ${idToStatus(
      status
    )} complete id: ${id}, departmentId: ${departmentId}`,
    id,
    departmentId
  );
  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("id", id)
      .input("status", status)
      .query(
        `UPDATE dbo.[scheduled_call] SET status = @status OUTPUT inserted.* WHERE id = @id`
      );
    if (res.recordset[0]) {
      return {
        visit: res.recordset[0],
        error: null,
      };
    }
    return {
      visit: null,
      error: "Error retrieving recordset",
    };
  } catch (error) {
    console.log(error);

    logger.error(error);
    return {
      visit: null,
      error: error.toString(),
    };
  }
};
