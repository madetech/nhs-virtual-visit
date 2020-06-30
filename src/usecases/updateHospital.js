export default ({ getDb }) => async ({ name, id, supportUrl = null }) => {
  const db = await getDb();

  try {
    const updatedHospital = await db.one(
      `UPDATE hospitals
      SET name = $1, support_url = $3
      WHERE
        id = $2
      RETURNING id
			`,
      [name, id, supportUrl]
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
