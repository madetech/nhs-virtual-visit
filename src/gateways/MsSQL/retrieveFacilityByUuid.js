import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (uuid) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .query(
      "SELECT id, name, code, status, uuid FROM dbo.[facility] WHERE uuid=@uuid"
    );
  return res.recordset[0];
};
