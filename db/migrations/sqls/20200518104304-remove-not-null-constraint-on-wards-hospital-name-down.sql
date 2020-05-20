UPDATE
  wards
SET
  hospital_name = (
    SELECT
      name
    FROM
      hospitals
    WHERE
      hospitals.id = wards.hospital_id
      AND hospitals.trust_id = wards.trust_id
  );

ALTER TABLE wards ALTER COLUMN hospital_name SET NOT NULL;
