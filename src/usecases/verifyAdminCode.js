import bcrypt from "bcryptjs";
import logger from "../../logger";

const verifyAdminCode = ({ getDb }) => async (email, password) => {
  const db = await getDb();

  if (!password) {
    return {
      validAdminCode: false,
      error: "password is not defined",
    };
  }

  try {
    const dbResponse = await db.any(
      `SELECT id, password FROM admins WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (dbResponse.length > 0) {
      const [admin] = dbResponse;

      if (!bcrypt.compareSync(password, admin.password))
        return {
          validAdminCode: false,
          error: "Incorrect email or password",
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
