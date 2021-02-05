//this should be a gateway too, but I'll leave it for now
export default ({ getMsSqlConnPool }) => async ({
  email,
  password,
  type,
  organisation_id,
}) => {
  const db = await getMsSqlConnPool();
  const result = await db
    .request()
    .input("email", email)
    .input("password", password)
    .input("type", type)
    .input("organisation_id", organisation_id)
    .query(
      `INSERT INTO dbo.[user] ([email], [password], [type], [organisation_id], [status]) OUTPUT INSERTED.*
    VALUES(@email, @password, @type, @organisation_id, 1)`
    );

  return {
    user: result.recordset[0],
  };
};
