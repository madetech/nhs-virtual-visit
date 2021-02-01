import mssql from "mssql";
export default ({ getMsSqlConnPool }) => async (organisationId) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("organisation_id", mssql.Int, organisationId)
    .query(
      `SELECT dbo.[facility].name AS hospitalName, dbo.[department].name AS wardName, dbo.[department].code AS wardCode, dbo.[department].id AS wardId FROM dbo.[facility] JOIN dbo.[department] ON dbo.[facility].id = dbo.[department].facility_id  WHERE dbo.[facility].organisation_id = @organisation_id AND dbo.[department].status = 1;`
    );
  return res.recordset;
};
