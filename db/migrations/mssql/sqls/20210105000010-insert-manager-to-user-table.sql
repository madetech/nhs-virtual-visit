USE nhs_virtual_visit_dev

INSERT INTO dbo.[user] ([email], [password], [type], [organisation_id], [status]) 
	VALUES('nhs-manager@nhs.co.uk', '$2b$10$Kwzuu07E.lx6ezpK58RYGuBZtrd9ULd5PsCPJXbe3BlN7Sax.rrmS', 'manager', 1, 1);