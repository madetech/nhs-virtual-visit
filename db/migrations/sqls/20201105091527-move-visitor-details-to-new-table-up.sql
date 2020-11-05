CREATE TABLE visitor_details (
    id serial PRIMARY KEY,
    recipient_name varchar(255) NOT NULL,
    recipient_email varchar(255),
    recipient_number varchar(255),
    ward_id integer NOT NULL REFERENCES wards (id),
    visit_id integer NOT NULL REFERENCES scheduled_calls_table (id)
);

INSERT INTO visitor_details (recipient_name, recipient_email, recipient_number, ward_id, visit_id) SELECT recipient_name, recipient_email, recipient_number, ward_id, id FROM scheduled_calls_table;

ALTER TABLE scheduled_calls_table ADD visitor_details_id integer REFERENCES visitor_details (id);

UPDATE scheduled_calls_table
SET visitor_details_id = visitor_details.id
FROM visitor_details
WHERE scheduled_calls_table.id = visitor_details.visit_id;

ALTER TABLE visitor_details DROP COLUMN visit_id;
ALTER TABLE scheduled_calls_table DROP COLUMN recipient_name;
ALTER TABLE scheduled_calls_table DROP COLUMN recipient_email;
ALTER TABLE scheduled_calls_table DROP COLUMN recipient_number;
