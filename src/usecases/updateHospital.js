export default ({ getDb }) => async (hospital) => {
  const db = await getDb();
  try {
    const updatedHospital = await db.one(
      `UPDATE hospitals
		SET name = $1
		WHERE
			id = $2
		RETURNING id
			`,
      [hospital.name, hospital.id]
    );
    return {
      id: updatedHospital.id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      id: null,
      error: error.toString(),
    };
  }
};
