import mssql from "mssql";
const updateManagerStatusByUuidGateway = ({ getMsSqlConnPool }) => async (
  uuid,
  status
) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .input("status", mssql.TinyInt, status)
    .query(
      "UPDATE dbo.[user] SET status = @status OUTPUT inserted.uuid WHERE uuid = @uuid"
    );
  return res.recordset[0].uuid;
};

export default updateManagerStatusByUuidGateway;
