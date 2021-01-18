const insertManagerGateway = ({ getMsSqlConnPool }) => async (
  email,
  password,
  organisationId,
  type
) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("email", email)
    .input("password", password)
    .input("type", type)
    .input("organisationId", organisationId)
    .query(
      "INSERT INTO dbo.[user] ([email], [password], [type], [organisation_id]) OUTPUT inserted.* VALUES (@email, @password, @type, @organisationId)"
    );
  return res.recordset[0];
};

export default insertManagerGateway;
