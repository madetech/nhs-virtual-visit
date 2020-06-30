const createHospital = ({ getDb }) => async ({
  name,
  trustId,
  supportUrl = null,
}) => {
  const db = await getDb();

  try {
    console.log("Creating hospital for", name);
    const createdHospital = await db.one(
      `INSERT INTO hospitals
          (id, name, trust_id, support_url)
          VALUES (default, $1, $2, $3)
          RETURNING id
        `,
      [name, trustId, supportUrl]
    );

    return {
      hospitalId: createdHospital.id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      hospitalId: null,
      error: error.toString(),
    };
  }
};

export default createHospital;
