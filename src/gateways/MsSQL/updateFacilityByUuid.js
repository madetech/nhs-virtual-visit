import mssql from "mssql";
export default ({ getMsSqlConnPool }) => async ({ uuid, status, name }) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .input("status", mssql.TinyInt, status)
    .input("name", mssql.NVarChar(255), name)
    .query(
      "UPDATE dbo.[facility] SET status = @status, name = @name OUTPUT inserted.uuid WHERE uuid = @uuid"
    );
  return res.recordset[0].uuid;
};
