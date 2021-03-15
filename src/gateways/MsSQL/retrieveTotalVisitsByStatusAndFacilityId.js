import { statusToId } from "../../helpers/visitStatus";

export default ({ getMsSqlConnPool }) => async ({ facilityId, status }) => {
    let queryString = `SELECT COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[department]
    JOIN dbo.[facility] ON facility.id=department.facility_id
    JOIN dbo.[scheduled_call] ON department_id = department.id
    WHERE facility_id = @facilityId`;
    if (status) {
      queryString = `${queryString} AND dbo.[scheduled_call].status = @status`
    }
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("facilityId", facilityId)
      .input("status", statusToId(status))
      .query(queryString);
      return res.recordset[0].total;
  };
  