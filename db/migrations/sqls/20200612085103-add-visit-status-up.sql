ALTER TABLE scheduled_calls_table ADD status varchar(20) NOT NULL DEFAULT 'scheduled';

UPDATE scheduled_calls_table SET status = 'scheduled';
