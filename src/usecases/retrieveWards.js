const retrieveWards = ({ getDb }) => async (trustId) => {
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
            AND trust_id = $1
        ) as hospital_name,
        wards.code as ward_code
      FROM
        wards
      WHERE
        wards.trust_id = $1
      ORDER BY
        name ASC,
        name ASC
    `,
      [trustId]
    );

    return {
      wards: wards.map((ward) => ({
        id: ward.ward_id,
        name: ward.ward_name,
        hospitalName: ward.hospital_name,
<<<<<<< HEAD
        code: ward.ward_code,
=======
        code: ward.code,
        archivedAt: ward.archived_at_string,
>>>>>>> Update retrieveWards to return archived_at
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
