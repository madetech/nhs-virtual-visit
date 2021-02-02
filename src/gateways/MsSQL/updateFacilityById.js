import mssql from "mssql";
export default ({ getMsSqlConnPool }) => async ({ id, name }) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .input("name", mssql.NVarChar(255), name)
    .query(
      "UPDATE dbo.[facility] SET name = @name OUTPUT inserted.uuid WHERE id = @id"
    );

  return res.recordset[0].uuid;
};
