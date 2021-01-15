const updateManagerByUuidGateway = async (db, uuid, status) => {
  await db
    .request()
    .input("uuid", uuid)
    .input("status", status)
    .query("UPDATE dbo.[user] SET status = @status WHERE uuid = @uuid");
};

export default updateManagerByUuidGateway;
