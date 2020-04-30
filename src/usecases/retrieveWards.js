const retrieveWards = ({ getDb }) => async () => {
  const db = await getDb();
  try {
    const wards = await db.any(
      `SELECT * FROM wards ORDER BY hospital_name ASC, name ASC`
    );

    return {
      wards: wards.map((ward) => ({
        id: ward.id,
        name: ward.name,
        hospitalName: ward.hospital_name,
        code: ward.code,
      })),
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      wards: null,
      error: error.toString(),
    };
  }
};

export default retrieveWards;
