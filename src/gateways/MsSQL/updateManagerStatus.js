const updateManagerStatusGateway = ({ getMsSqlConnPool }) => async (
  id,
  status
) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", id)
    .input("status", status)
    .query(
      `UPDATE dbo.[user] SET status = @status OUTPUT inserted.* WHERE id = @id`
    );
  return res.recordset[0];
};

export default updateManagerStatusGateway;
