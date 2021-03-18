import { statusToId, COMPLETE, ARCHIVED } from "../../helpers/visitStatus";

export default ({ getMsSqlConnPool }) => async ({ orgId }) => {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("orgId", orgId)
      .input("completedStatus", statusToId(COMPLETE))
      .input("archivedStatus", statusToId(ARCHIVED))
      .query(`SELECT COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[department]
      JOIN dbo.[facility] ON facility.id=department.facility_id
      JOIN dbo.[scheduled_call] ON department_id = department.id
      WHERE organisation_id = @orgID AND dbo.[scheduled_call].status = @completedStatus OR (dbo.[scheduled_call].status = @archivedStatus AND dbo.[scheduled_call].end_time IS NOT NULL)`);
    return res.recordset[0].total;
  };
