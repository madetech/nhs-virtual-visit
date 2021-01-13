const insertManagerGateway = async (
  db,
  email,
  password,
  organisationId,
  type
) => {
  await db
    .request()
    .input("email", email)
    .input("password", password)
    .input("type", type)
    .input("organisationId", organisationId)
    .query(
      "INSERT INTO dbo.[user] ([email], [password], [type], [organisation_id]) VALUES (@email, @password, @type, @organisationId)"
    );
};

export default insertManagerGateway;
