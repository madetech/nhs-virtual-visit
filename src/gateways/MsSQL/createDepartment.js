import mssql from "mssql";
import bcrypt from "bcryptjs";
export default ({ getMsSqlConnPool }) => async ({
  name,
  code,
  facilityId,
  pin,
  createdBy,
}) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPin = bcrypt.hashSync(pin, salt);
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("name", mssql.NVarChar(255), name)
    .input("facilityId", mssql.Int, facilityId)
    .input("code", mssql.NVarChar(255), code)
    .input("pin", mssql.NVarChar(255), hashedPin)
    .input("createdBy", mssql.Int, createdBy)
    .query(
      "INSERT INTO dbo.[department] ([name], [facility_id], [code], [pin], [created_by]) OUTPUT inserted.uuid VALUES (@name, @facilityId, @code, @pin, @createdBy)"
    );
  return res.recordset[0].uuid;
};
