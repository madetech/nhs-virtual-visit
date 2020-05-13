const retrieveWardById = ({ getDb }) => async (wardId, trustId) => {
  const db = await getDb();
  console.log("Retrieving ward for  ", wardId);
  try {
    const ward = await db.oneOrNone(
      "SELECT * FROM wards WHERE id = $1 AND trust_id = $2 LIMIT 1",
      [wardId, trustId]
    );

    return {
      ward: {
        id: ward.id,
        name: ward.name,
        hospitalName: ward.hospital_name,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      ward: null,
      error: error.toString(),
    };
  }
};

export default retrieveWardById;
