DELETE from scheduled_calls_table WHERE call_time < (now() - INTERVAL '1 DAY');
