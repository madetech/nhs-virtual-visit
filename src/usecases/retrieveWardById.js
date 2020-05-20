const retrieveWardById = ({ getDb }) => async (wardId, trustId) => {
  const db = await getDb();
  try {
    const ward = await db.one(
      `SELECT
        wards.id as ward_id,
        wards.name as ward_name,
        (
          SELECT
            name
          FROM
            hospitals
          WHERE
            id = wards.hospital_id
            AND trust_id = $2
        ) as hospital_name,
        wards.hospital_id as hospital_id
      FROM 
        wards
      WHERE
        wards.id = $1
      AND 
        wards.trust_id = $2
      AND 
        wards.archived_at is NULL
      LIMIT
        1
      `,
      [wardId, trustId]
    );

    return {
      ward: {
        id: ward.ward_id,
        name: ward.ward_name,
        hospitalId: ward.hospital_id,
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
