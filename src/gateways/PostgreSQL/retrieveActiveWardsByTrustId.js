const recordToDomain = ({ hospital_name, ward_code, ward_id, ward_name }) => ({
  hospitalName: hospital_name,
  wardCode: ward_code,
  wardName: ward_name,
  wardId: ward_id,
});
const recordsToDomain = (records) => records.map(recordToDomain);

const retrieveActiveWardsByTrustIdQuery = async (db, trustId) =>
  await db.any(
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
    AND
      wards.archived_at IS NULL
    ORDER BY
      name ASC,
      name ASC
  `,
    [trustId]
  );

export default ({ getDb }) => async (trustId) =>
  recordsToDomain(
    await retrieveActiveWardsByTrustIdQuery(await getDb(), trustId)
  );
