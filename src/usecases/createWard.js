const createWard = ({ getDb }) => async (ward) => {
  const db = await getDb();

  try {
    console.log("Creating ward for ", ward);
    const createdWard = await db.one(
      `INSERT INTO wards
        (id, name, hospital_name, code, trust_id, hospital_id)
        VALUES (default, $1, $2, $3, $4, $5)
        RETURNING id
      `,
      [ward.name, ward.hospitalName, ward.code, ward.trustId, ward.hospitalId]
    );

    return {
      wardId: createdWard.id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      wardId: null,
      error: error.toString(),
    };
  }
};

export default createWard;
