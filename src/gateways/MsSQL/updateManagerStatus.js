const updateManagerStatusGateway = async (db, email, status) => {
  const res = await db
    .request()
    .input("email", email)
    .input("status", status)
    .query(
      `UPDATE dbo.[user] SET status = @status OUTPUT inserted.* WHERE email = @email`
    );
  return res.recordset[0];
};

export default updateManagerStatusGateway;
