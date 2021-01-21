import mssql from "mssql";
export default ({ getMsSqlConnPool }) => async ({
  name,
  orgId,
  code,
  userId,
}) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("name", mssql.NVarChar(255), name)
    .input("orgId", mssql.Int, orgId)
    .input("code", mssql.NVarChar(255), code)
    .input("userId", mssql.Int, userId)
    .query(
      "INSERT INTO dbo.[facility] ([name], [organisation_id], [code], [created_by]) OUTPUT inserted.id VALUES (@name, @orgId, @code, @userId)"
    );
  console.log("***CREATEFacility");
  console.log(res.recordset);
  return res.recordset[0].id;
};
