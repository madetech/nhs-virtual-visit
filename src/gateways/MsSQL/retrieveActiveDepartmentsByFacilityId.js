import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (id) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .query(
      "SELECT id, facility_id AS facilityId, uuid, name, code, status FROM dbo.[department] WHERE facility_id = @id AND status = 1"
    );
  return res.recordset;
};
