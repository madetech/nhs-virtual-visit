import logger from "../../logger";
import Database from "./Database";

const retrieveWardById = async (wardId, trustId) => {
  const db = await Database.getInstance();

  try {
    const ward = await db.one(
      `SELECT
        wards.id as ward_id,
        wards.name as ward_name,
        wards.status as ward_status,
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
        status: ward.ward_status,
        hospitalId: ward.hospital_id,
        hospitalName: ward.hospital_name,
      },
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      ward: null,
      error: error.toString(),
    };
  }
};

export default retrieveWardById;
