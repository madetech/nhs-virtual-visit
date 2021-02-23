import mssql from "mssql";
import bcrypt from "bcryptjs";

export default ({ getMsSqlConnPool }) => async ({ id, name, pin }) => {
  let queryString = "UPDATE dbo.[department] SET name = @name OUTPUT inserted.uuid WHERE id = @id"
  let hashedPin;
  if (pin) {
    const salt = bcrypt.genSaltSync(10);
    hashedPin = bcrypt.hashSync(pin, salt);
    queryString = "UPDATE dbo.[department] SET name = @name, pin = @pin OUTPUT inserted.uuid WHERE id = @id"
  }

  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("id", mssql.Int, id)
    .input("name", mssql.NVarChar(255), name)
    .input("pin", mssql.NVarChar(255), hashedPin)
    .query(queryString);
  return res.recordset[0].uuid;
};
