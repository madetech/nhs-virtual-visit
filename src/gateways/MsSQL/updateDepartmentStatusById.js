import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async ({ id, status }) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .input("status", mssql.TinyInt, status)
    .query(
      "UPDATE dbo.[department] SET status = @status OUTPUT inserted.uuid WHERE id = @id"
    );
  return res.recordset[0].uuid;
};
