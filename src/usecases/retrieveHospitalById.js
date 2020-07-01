const retrieveHospitalById = ({ getDb }) => async (hospitalId, trustId) => {
  const db = await getDb();
  console.log("Retrieving hospital for  ", hospitalId);
  try {
    const hospital = await db.oneOrNone(
      "SELECT * FROM hospitals WHERE id = $1 AND trust_id = $2 LIMIT 1",
      [hospitalId, trustId]
    );

    return {
      hospital: {
        id: hospital.id,
        name: hospital.name,
        supportUrl: hospital.support_url,
        surveyUrl: hospital.survey_url,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      hospital: null,
      error: error.toString(),
    };
  }
};

export default retrieveHospitalById;
