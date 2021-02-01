import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (wardCode) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("code", mssql.VarChar(255), wardCode)
    .query(
      "SELECT dbo.[department].id AS wardId, dbo.[department].uuid, dbo.[department].code AS wardCode, dbo.[facility].organisation_id AS trustId, dbo.[department].status AS wardStatus FROM dbo.[department] JOIN dbo.[facility] ON dbo.[department].facility_id = dbo.[facility].id WHERE dbo.[department].code = @code"
    );
  return res.recordset[0];
};
