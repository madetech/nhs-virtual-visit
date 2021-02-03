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
        `UPDATE dbo.[scheduled_call] SET status = @status OUTPUT inserted.id WHERE id = @id`
      );

    return {
      id: res.recordset[0].id,
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
