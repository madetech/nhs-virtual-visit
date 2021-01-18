import mssql from "mssql";

const archiveManagerByUuidGateway = ({ getMsSqlConnPool }) => async (uuid) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .query("DELETE FROM dbo.[user] OUTPUT deleted.uuid WHERE uuid = @uuid");
  return res.recordset[0].uuid;
};

export default archiveManagerByUuidGateway;
