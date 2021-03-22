import { statusToId, COMPLETE, ARCHIVED } from "../../helpers/visitStatus";

export default ({ getMsSqlConnPool }) => async ({ id }) => {
    let idNum, columnName;

    if (id?.orgId) {
        idNum = id.orgId;
        columnName = "organisation_id";
    } else if (id?.facilityId) {
        idNum = id.facilityId;
        columnName = "facility_id";
    } else {
      throw("Invalid id type!");
    }

    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("id", idNum)
      .input("completedStatus", statusToId(COMPLETE))
      .input("archivedStatus", statusToId(ARCHIVED))
      .query(`SELECT COUNT(dbo.[scheduled_call].id) AS total FROM dbo.[department]
      JOIN dbo.[facility] ON facility.id=department.facility_id
      JOIN dbo.[scheduled_call] ON department_id = department.id
      WHERE ${columnName} = @id AND (dbo.[scheduled_call].status = @completedStatus OR (dbo.[scheduled_call].status = @archivedStatus AND dbo.[scheduled_call].end_time IS NOT NULL))`);
    return res.recordset[0].total;
  };
