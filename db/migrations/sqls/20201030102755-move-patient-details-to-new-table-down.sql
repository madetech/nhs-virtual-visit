ALTER TABLE scheduled_calls_table ADD patient_name varchar(255);

UPDATE scheduled_calls_table
SET patient_name = patient_details.patient_name
FROM patient_details
WHERE scheduled_calls_table.patient_details_id = patient_details.id;

ALTER TABLE scheduled_calls_table DROP column patient_details_id;

DROP TABLE patient_details;
