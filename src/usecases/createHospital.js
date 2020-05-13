const createHospital = ({ getDb }) => async ({ name, trustId }) => {
  const db = await getDb();

  try {
    console.log("Creating hospital for", name);
    const createdHospital = await db.one(
      `INSERT INTO hospitals
          (id, name, trust_id)
          VALUES (default, $1, $2)
          RETURNING id
        `,
      [name, trustId]
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
