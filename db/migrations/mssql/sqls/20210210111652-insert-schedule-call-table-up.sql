INSERT INTO dbo.[scheduled_call] ([department_id], [uuid], [patient_name], [call_time], [call_password], [recipient_name], [recipient_email])
	VALUES(1, '3611b934-e574-4192-b443-e05753660cc5', 'Alice', DATEADD(hh, 1, getdate()), 'password', 'Bob', 'example@example.com');

INSERT INTO dbo.[scheduled_call] ([department_id], [uuid], [patient_name], [call_time], [call_password], [recipient_name])
	VALUES(1, '08fd4e7b-91c0-4cc0-b912-f89b7e5bfafd', 'Elliot', DATEADD(hh, 1, getdate()), 'password', 'Bob');
