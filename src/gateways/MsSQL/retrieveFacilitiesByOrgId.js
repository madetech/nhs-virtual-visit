import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async ({
  orgId,
  options = { withWards: false },
}) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("orgId", mssql.Int, orgId)
    .query(
      "SELECT name, id, code, status, uuid FROM dbo.[facility] WHERE organisation_id=@orgId ORDER BY name"
    );
  let facilities = res.recordset;
  if (options.withWards) {
    facilities = await Promise.all(
      facilities.map(async (facility) => {
        const departments = await db
          .request()
          .input("facility_id", mssql.Int, facility.id)
          .query(
            "SELECT * FROM dbo.[department] WHERE facility_id = @facility_id ORDER BY name"
          );
        return {
          id: facility.id,
          uuid: facility.uuid,
          name: facility.name,
          code: facility.code,
          status: facility.status,
          departments: departments.recordset.map((department) => ({
            id: department.id,
            name: department.name,
          })),
        };
      })
    );
  }
  return facilities;
};
