import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (id) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .query(
      "UPDATE dbo.[department] SET status = 0 OUTPUT inserted.uuid WHERE id = @id"
    );
  return res.recordset[0].uuid;
};
