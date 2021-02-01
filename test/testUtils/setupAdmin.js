import bcrypt from "bcryptjs";

export default ({ getMsSqlConnPool }) => async ({
  email,
  password,
  type = "admin",
}) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const db = await getMsSqlConnPool();
  const response = await db
    .request()
    .input("email", email)
    .input("password", hashedPassword)
    .input("type", type)
    .query(
      `INSERT INTO dbo.[user] ([email], [password], [type], [status])
        OUTPUT INSERTED.[id]
        VALUES (@email, @password, @type, 1)`
    );
  const admin = response.recordset[0];
  return admin;
};
