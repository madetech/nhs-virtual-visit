import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (facilityId) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("facilityId", mssql.Int, facilityId)
    .query(
      "SELECT id, name, code, status, uuid FROM dbo.[facility] WHERE id=@facilityId"
    );
  return res.recordset[0];
};
