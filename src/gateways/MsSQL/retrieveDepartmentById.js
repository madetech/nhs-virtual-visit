export default ({ getMsSqlConnPool }) => async (id) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", id)
    .query(
      "SELECT id, uuid, name, code, status, facility_id AS facilityId FROM dbo.[department] WHERE id = @id"
    );
  return res.recordset[0];
};
