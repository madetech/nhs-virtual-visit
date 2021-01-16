const updateManagerStatusByUuidGateway = async (db, uuid, status) => {
  const res = await db
    .request()
    .input("uuid", uuid)
    .input("status", status)
    .query(
      "UPDATE dbo.[user] SET status = @status OUTPUT inserted.uuid WHERE uuid = @uuid"
    );
  return res.recordset[0].uuid;
};

export default updateManagerStatusByUuidGateway;
