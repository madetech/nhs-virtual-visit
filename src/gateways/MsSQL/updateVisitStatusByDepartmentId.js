export default ({ getMsSqlConnPool }) => async ({ departmentId, status }) => {
  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("departmentId", departmentId)
      .input("status", status)
      .query(
        `UPDATE dbo.[scheduled_call] SET status = @status OUTPUT inserted.* WHERE department_id = @departmentId`
      );

    return {
      visits: response.recordset[0],
      error: null,
    };
  } catch (error) {
    return {
      visits: null,
      error: error.toString(),
    };
  }
};
