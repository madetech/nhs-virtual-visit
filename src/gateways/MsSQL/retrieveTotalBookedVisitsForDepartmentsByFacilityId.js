import {ACTIVE, statusToId } from "../../helpers/statusTypes";
export default ({ getMsSqlConnPool }) => async (facilityId) => {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("facilityId", facilityId)
      .input("status", statusToId(ACTIVE))
      .query(
        `SELECT dbo.[department].uuid, dbo.[department].name, dbo.[department].code, COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[department]
        JOIN dbo.[facility] ON facility.id=department.facility_id
        LEFT JOIN dbo.[scheduled_call] ON department_id = department.id
        WHERE facility_id = @facilityId AND department.status = @status
        GROUP BY dbo.[department].uuid, dbo.[department].name, dbo.[department].code
        ORDER BY dbo.[department].name`
      );
    return res.recordset;
  };