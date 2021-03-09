import bcrypt from "bcryptjs";

const insertManagerGateway = ({ getMsSqlConnPool, logger }) => async ({
  email,
  password,
  organisationId,
  type,
}) => {
  logger.info(`Creating manager ${email}`);

  try {
    const db = await getMsSqlConnPool();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const res = await db
      .request()
      .input("email", email)
      .input("password", hashedPassword)
      .input("type", type)
      .input("organisationId", organisationId)
      .query(
        "INSERT INTO dbo.[user] ([email], [password], [type], [organisation_id]) OUTPUT inserted.* VALUES (@email, @password, @type, @organisationId)"
      );

    return {
      user: res.recordset[0],
      error: null,
    };
  } catch (error) {
    logger.error(`Error creating manager ${email}, ${error}`);
    return {
      user: null,
      error: error.toString(),
    };
  }
};

export default insertManagerGateway;
