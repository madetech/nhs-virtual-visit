export default ({ getMsSqlConnPool }) => async () => {
  const db = await getMsSqlConnPool();
  const response = await db
    .request()
    .query(
      `SELECT * FROM dbo.[scheduled_call]`
    );

    return { calls: response.recordset }
}