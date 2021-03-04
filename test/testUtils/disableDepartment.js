import mssql from "mssql";
import { DISABLED, statusToId } from "../../src/helpers/statusTypes";

export default ({ getMsSqlConnPool }) => async ({ id }) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .input("status", mssql.TinyInt, statusToId(DISABLED))
    .query(
      "UPDATE dbo.[department] SET status = @status OUTPUT inserted.uuid WHERE id = @id"
    );
  return res.recordset[0].uuid;
};