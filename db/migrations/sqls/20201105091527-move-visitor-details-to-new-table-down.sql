ALTER TABLE scheduled_calls_table ADD recipient_name varchar(255);
ALTER TABLE scheduled_calls_table ADD recipient_email varchar(255);
ALTER TABLE scheduled_calls_table ADD recipient_number varchar(255);

UPDATE scheduled_calls_table
SET recipient_name = visitor_details.recipient_name, recipient_email = visitor_details.recipient_email, recipient_number = visitor_details.recipient_number
FROM visitor_details
WHERE scheduled_calls_table.visitor_details_id = visitor_details.id;

ALTER TABLE scheduled_calls_table DROP column visitor_details_id;

DROP TABLE visitor_details;
