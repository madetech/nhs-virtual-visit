export default ({ getMsSqlConnPool }) => async (departmentId) => {
  try {
    const db = await getMsSqlConnPool();

    const res = await db
      .request()
      .input("departmentId", departmentId)
      .query(
        "SELECT * FROM dbo.[scheduled_call] WHERE [department_id] = @departmentId"
      );

    return {
      error: null,
      visits: res.recordset,
    };
  } catch (error) {
    return {
      error,
    };
  }
};
