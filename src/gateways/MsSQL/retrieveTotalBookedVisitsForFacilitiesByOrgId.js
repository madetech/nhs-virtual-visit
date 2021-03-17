
import {ACTIVE, statusToId } from "../../helpers/statusTypes";
export default ({ getMsSqlConnPool }) => async (orgId) => {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("organisationId", orgId)
      .input("status", statusToId(ACTIVE))
      .query(
        `SELECT dbo.[facility].id, dbo.[facility].name, dbo.[facility].uuid, COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[facility]
        LEFT JOIN dbo.[department] ON facility.id=department.facility_id
        LEFT JOIN dbo.[scheduled_call] ON department_id = department.id
        WHERE facility.organisation_id = @organisationId AND facility.status = @status
        GROUP BY dbo.[facility].id, dbo.[facility].name, dbo.[facility].uuid
        ORDER BY dbo.[facility].name ASC`
      );
    return res.recordset;
  };