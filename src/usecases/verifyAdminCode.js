const verifyAdminCode = ({ getDb }) => async (code) => {
  const db = await getDb();

  try {
    const dbResponse = await db.any(
      `SELECT id FROM admins WHERE code = $1 LIMIT 1`,
      [code]
    );

    if (dbResponse.length > 0) {
      return {
        validAdminCode: true,
        error: null,
      };
    } else {
      return { validAdminCode: false, error: null };
    }
  } catch (error) {
    console.log(error);

    return {
      validAdminCode: false,
      error: error.toString(),
    };
  }
};

export default verifyAdminCode;
