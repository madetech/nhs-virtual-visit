const retrieveManagerByUuidGateway = ({ getMsSqlConnPool }) => async (uuid) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", uuid)
    .query(
      "SELECT email, organisation_id, uuid, status FROM dbo.[user] WHERE uuid = @uuid"
    );
  return res.recordset[0];
};

export default retrieveManagerByUuidGateway;
