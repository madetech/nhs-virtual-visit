export default ({ getDb }) => async (ward) => {
  const db = await getDb();
  try {
    const updatedWard = await db.one(
      `UPDATE wards
      SET name = $1,
          hospital_name = $2,
          hospital_id = $3
      WHERE
          id = $4
      RETURNING id
          `,
      [ward.name, ward.hospitalName, ward.hospitalId, ward.id]
    );
    return {
      wardId: updatedWard.id,
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
