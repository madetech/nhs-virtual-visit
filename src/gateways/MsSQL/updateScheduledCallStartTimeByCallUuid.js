export default ({ getMsSqlConnPool }) => async (
    callUuid
) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("callUuid", callUuid)
    .query(
      "UPDATE dbo.[scheduled_call] SET start_time=GETDATE() OUTPUT inserted.* WHERE uuid = @callUuid"
    );
  return res.recordset[0];
};