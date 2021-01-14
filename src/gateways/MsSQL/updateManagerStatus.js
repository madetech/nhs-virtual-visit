const updateManagerStatusGateway = async (db, email, status) => {
  await db
    .request()
    .input("email", email)
    .input("status", status)
    .query(`UPDATE dbo.[user] SET status = @status WHERE email = @email`);
};

export default updateManagerStatusGateway;
