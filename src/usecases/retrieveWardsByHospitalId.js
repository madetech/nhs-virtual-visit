const retrieveWardsByHospitalId = ({ getDb }) => async (hospitalId) => {
  const db = await getDb();
  try {
    const wards = await db.any(
      `SELECT
        id as ward_id,
        name as ward_name,
        (
          SELECT
            name
          FROM
            hospitals
          WHERE
            wards.hospital_id = id
        ) as hospital_name,
        wards.code as ward_code
      FROM
        wards
      WHERE
        wards.hospital_id = $1
      AND
        wards.archived_at IS NULL
      ORDER BY
        name ASC
    `,
      [hospitalId]
    );

    return {
      wards: wards.map((ward) => ({
        id: ward.ward_id,
        name: ward.ward_name,
        hospitalName: ward.hospital_name,
        code: ward.ward_code,
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

export default retrieveWardsByHospitalId;
