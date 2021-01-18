const addToUserVerificationTableGateway = ({ getMsSqlConnPool }) => async (
  user_id,
  code,
  hash,
  type
) => {
  const db = await getMsSqlConnPool();
  await db
    .request()
    .input("user_id", user_id)
    .input("code", code)
    .input("hash", hash)
    .input("type", type)
    .query(
      "INSERT INTO dbo.[user_verification] ([user_id], [code], [hash], [type]) VALUES (@user_id, @code, @hash, @type)"
    );
};

export default addToUserVerificationTableGateway;
