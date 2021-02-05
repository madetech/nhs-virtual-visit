import mssql from "mssql";

const retrieveManagerByUuidGateway = ({ getMsSqlConnPool }) => async (uuid) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .query("SELECT * FROM dbo.[user] WHERE uuid = @uuid");
  return res.recordset[0];
};

export default retrieveManagerByUuidGateway;
