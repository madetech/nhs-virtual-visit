import mssql from "mssql";
export default ({ getMsSqlConnPool }) => async ({ id, status, name }) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .input("status", mssql.TinyInt, status)
    .input("name", mssql.NVarChar(255), name)
    .query(
      "UPDATE dbo.[facility] SET status = @status, name = @name OUTPUT inserted.uuid WHERE id = @id"
    );
  return res.recordset[0].uuid;
};
