import mssql from "mssql";
export default ({ getMsSqlConnPool }) => async ({
  name,
  orgId,
  code,
  createdBy,
}) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("name", mssql.NVarChar(255), name)
    .input("orgId", mssql.Int, orgId)
    .input("code", mssql.NVarChar(255), code)
    .input("createdBy", mssql.Int, createdBy)
    .query(
      "INSERT INTO dbo.[facility] ([name], [organisation_id], [code], [created_by]) OUTPUT inserted.id VALUES (@name, @orgId, @code, @createdBy)"
    );
  return res.recordset[0].id;
};
