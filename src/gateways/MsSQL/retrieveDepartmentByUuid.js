import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (uuid) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .query(
      "SELECT pin, id, uuid, name, code, status, facility_id AS facilityId FROM dbo.[department] WHERE uuid = @uuid"
    );
  return res.recordset[0];
};
