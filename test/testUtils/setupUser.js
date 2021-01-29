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
      `INSERT INTO dbo.[user] ([email], [password], [type], [organisation_id], [status]) OUTPUT INSERTED.[id]
    VALUES(@email, @password, @type, @organisation_id, 1)`
    );
  console.log(result);
  return {
    id: result.recordset[0].id
  };
};
