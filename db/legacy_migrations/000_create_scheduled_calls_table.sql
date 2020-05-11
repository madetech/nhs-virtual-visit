CREATE TABLE scheduled_calls_table (
    id serial PRIMARY KEY,
    patient_name text,
    call_time timestamp with time zone,
    recipient_number text,
    call_id text
);
