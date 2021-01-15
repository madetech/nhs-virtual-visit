const archiveManagerByUuidGateway = async (db, uuid) => {
  await db
    .request()
    .input("uuid", uuid)
    .query("DELETE FROM dbo.[user] WHERE uuid = @uuid");
};

export default archiveManagerByUuidGateway;
