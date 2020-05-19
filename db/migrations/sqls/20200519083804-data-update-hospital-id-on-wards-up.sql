UPDATE
  wards
SET
  hospital_id = (
    SELECT
      id
    FROM
      hospitals
    WHERE
      hospitals.name = wards.hospital_name
      AND hospitals.trust_id = wards.trust_id
  );
