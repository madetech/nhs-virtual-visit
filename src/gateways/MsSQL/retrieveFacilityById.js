import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (facilityId, orgId) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("orgId", mssql.Int, orgId)
    .input("facilityId", mssql.Int, facilityId)
    .query(
      "SELECT id, name, code, status, uuid FROM dbo.[facility] WHERE organisation_id = @orgId AND id=facilityId"
    );
  return res.recordset[0];
};
