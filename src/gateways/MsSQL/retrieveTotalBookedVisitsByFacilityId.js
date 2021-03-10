export default ({ getMsSqlConnPool }) => async (facilityId) => {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("facilityId", facilityId)
      .query(
        `SELECT COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[department]
        JOIN dbo.[facility] ON facility.id=department.facility_id
        JOIN dbo.[scheduled_call] ON department_id = department.id
        WHERE facility_id = @facilityId`
      );
      return res.recordset[0].total;
  };
  