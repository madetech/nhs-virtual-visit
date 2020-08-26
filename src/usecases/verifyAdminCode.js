import bcrypt from "bcryptjs";
import logger from "../../logger";

const verifyAdminCode = ({ getDb }) => async (code, password) => {
  const db = await getDb();

  if (!password) {
    return {
      validAdminCode: false,
      error: "password is not defined",
    };
  }

  try {
    const dbResponse = await db.any(
      `SELECT id, password FROM admins WHERE code = $1 LIMIT 1`,
      [code]
    );

    if (dbResponse.length > 0) {
      const [admin] = dbResponse;

      if (!bcrypt.compareSync(password, admin.password))
        return {
          validAdminCode: false,
          error: "Incorrect trust admin code or password",
        };

      return {
        validAdminCode: true,
        error: null,
      };
    } else {
      return {
        validAdminCode: false,
        error: null,
      };
    }
  } catch (error) {
    logger.error(error);

    return {
      validAdminCode: false,
      error: error.toString(),
    };
  }
};

export default verifyAdminCode;
