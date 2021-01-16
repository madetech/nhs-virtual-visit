const archiveManagerByUuidGateway = async (db, uuid) => {
  const res = await db
    .request()
    .input("uuid", uuid)
    .query("DELETE FROM dbo.[user] OUTPUT deleted.uuid WHERE uuid = @uuid");
  return res.recordset[0].uuid;
};

export default archiveManagerByUuidGateway;
