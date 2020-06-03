const retrieveHospitalsByTrustId = ({ getDb }) => async (
  trustId,
  options = { withWards: false }
) => {
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

    if (options.withWards) {
      hospitals = await Promise.all(
        hospitals.map(async (hospital) => {
          const wards = await db.any(
            `SELECT * FROM wards WHERE hospital_id = $1`,
            hospital.id
          );

          return {
            id: hospital.id,
            name: hospital.name,
            wards: wards.map((ward) => ({ id: ward.id, name: ward.name })),
          };
        })
      );
    }

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
