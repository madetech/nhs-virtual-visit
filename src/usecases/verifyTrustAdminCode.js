import logger from "../../logger";
import bcrypt from "bcryptjs";

const verifyTrustAdminCode = ({ getDb }) => async (
  trustAdminCode,
  password
) => {
  if (!password) {
    return {
      validTrustAdminCode: false,
      trust: null,
      error: "password is not defined",
    };
  }

  const db = await getDb();

  try {
    const dbResponse = await db.any(
      `SELECT id, password FROM trusts WHERE admin_code = $1 LIMIT 1`,
      [trustAdminCode]
    );

    if (dbResponse.length > 0) {
      let [trust] = dbResponse;

      if (!bcrypt.compareSync(password, trust.password))
        return {
          validTrustAdminCode: false,
          trust: null,
          error: "Incorrect trust admin code or password",
        };

      return {
        validTrustAdminCode: true,
        trust: { id: trust.id },
        error: null,
      };
    } else {
      return { validTrustAdminCode: false, trust: null, error: null };
    }
  } catch (error) {
    logger.error(error);

    return {
      validTrustAdminCode: false,
      error: error.toString(),
      trust: null,
    };
  }
};

export default verifyTrustAdminCode;
