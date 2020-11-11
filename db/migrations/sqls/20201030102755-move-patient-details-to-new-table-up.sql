CREATE TABLE patient_details (
    id serial PRIMARY KEY,
    patient_name varchar(255),
    ward_id integer NOT NULL REFERENCES wards (id),
    visit_id integer NOT NULL REFERENCES scheduled_calls_table (id)
);

INSERT INTO patient_details (patient_name, ward_id, visit_id) SELECT patient_name, ward_id, id FROM scheduled_calls_table;

ALTER TABLE scheduled_calls_table ADD patient_details_id integer REFERENCES patient_details (id);

UPDATE scheduled_calls_table
SET patient_details_id = patient_details.id
FROM patient_details
WHERE scheduled_calls_table.id = patient_details.visit_id;

ALTER TABLE patient_details DROP COLUMN visit_id;
ALTER TABLE scheduled_calls_table DROP COLUMN patient_name;
