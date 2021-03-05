export default ({ getMsSqlConnPool }) => async (orgId) => {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("orgId", orgId)
      .query(
        `SELECT COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[department]
        JOIN dbo.[facility] ON facility.id=department.facility_id
        JOIN dbo.[scheduled_call] ON department_id = department.id
        WHERE organisation_id = @orgId`
      );
    return res.recordset[0].total;
  };
  