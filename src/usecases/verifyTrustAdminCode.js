const verifyTrustAdminCode = ({ getDb }) => async (trustAdminCode) => {
  const db = await getDb();

  try {
    const dbResponse = await db.any(
      `SELECT id FROM trusts WHERE admin_code = $1 LIMIT 1`,
      [trustAdminCode]
    );

    if (dbResponse.length > 0) {
      let [trust] = dbResponse;

      return {
        validTrustAdminCode: true,
        trust: { id: trust.id },
        error: null,
      };
    } else {
      return { validTrustAdminCode: false, error: null };
    }
  } catch (error) {
    console.log(error);

    return {
      validTrustAdminCode: false,
      error: error.toString(),
    };
  }
};

export default verifyTrustAdminCode;
