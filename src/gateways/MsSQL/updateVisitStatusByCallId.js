import { idToStatus , COMPLETE } from "../../helpers/visitStatus";

export default ({ getMsSqlConnPool, logger }) => async ({
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
    let queryString = `UPDATE dbo.[scheduled_call] SET status = @status OUTPUT inserted.* WHERE uuid = @id`

    if (idToStatus(status) === COMPLETE) {
      queryString = `UPDATE dbo.[scheduled_call] SET status = @status, end_time = GETDATE() OUTPUT inserted.* WHERE uuid = @id`
    }

    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("id", id)
      .input("status", status)
      .query(queryString);

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
    logger.error(error);
    return {
      visit: null,
      error: error.toString(),
    };
  }
};
