const retrieveWardById = ({ getDb }) => async (wardId) => {
  const db = await getDb();
  console.log("Retrieving ward for  ", wardId);
  try {
    // Assuming there is only one Ward to choose from for now
    const ward = await db.oneOrNone("SELECT * FROM wards LIMIT 1", wardId);

    console.log("Ward: ", ward);

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
