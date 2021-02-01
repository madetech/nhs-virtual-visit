import logger from "../../../logger";

const insertManagerGateway = ({ getMsSqlConnPool }) => async ({
  email,
  password,
  organisationId,
  type,
}) => {
  logger.info(`Creating manager ${email}`);

  try {
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
