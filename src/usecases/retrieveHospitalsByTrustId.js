const retrieveHospitalsByTrustId = ({ getDb }) => async (trustId) => {
  const db = await getDb();
  let hospitals = [];
  try {
    hospitals = await db.any(
      `SELECT * FROM hospitals WHERE trust_id = $1`,
      trustId
    );

    hospitals = hospitals.map((row) => ({
      id: row.id,
      name: row.name,
    }));

    return {
      hospitals: hospitals,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      hospitals: [],
      error: error.toString(),
    };
  }
};

export default retrieveHospitalsByTrustId;
