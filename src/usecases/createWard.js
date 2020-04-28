const createWard = ({ getDb }) => async (ward) => {
  const db = await getDb();

  try {
    console.log("Creating ward for ", ward);
    const createdWard = await db.one(
      `INSERT INTO wards
        (id, name, hospital_name)
        VALUES (default, $1, $2)
        RETURNING id
      `,
      [ward.name, ward.hospitalName]
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
