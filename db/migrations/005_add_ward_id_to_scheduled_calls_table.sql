ALTER TABLE scheduled_calls_table ADD ward_id int REFERENCES wards (id);
