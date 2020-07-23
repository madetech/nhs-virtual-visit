ALTER TABLE scheduled_calls_table ADD COLUMN pii_cleared_at timestamp with time zone;

UPDATE scheduled_calls_table SET pii_cleared_at = NOW() WHERE STATUS = ANY('{complete,archived,cancelled}'::text[]);
