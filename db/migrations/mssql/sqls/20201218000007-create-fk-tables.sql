ALTER TABLE dbo.[user] ADD CONSTRAINT FK_user_organisation FOREIGN KEY ([organisation_id]) REFERENCES dbo.[organisation] ([id])

ALTER TABLE dbo.[organisation] ADD CONSTRAINT FK_organisation_user FOREIGN KEY ([created_by]) REFERENCES dbo.[user] ([id])

ALTER TABLE dbo.[facility] ADD CONSTRAINT FK_facility_organisation FOREIGN KEY ([organisation_id]) REFERENCES dbo.[organisation] ([id])

ALTER TABLE dbo.[facility] ADD CONSTRAINT FK_facility_user FOREIGN KEY ([created_by]) REFERENCES dbo.[user] ([id])

ALTER TABLE dbo.[department] ADD CONSTRAINT FK_department_facility FOREIGN KEY ([facility_id]) REFERENCES dbo.[facility] ([id])

ALTER TABLE dbo.[department] ADD CONSTRAINT FK_department_user FOREIGN KEY ([created_by]) REFERENCES dbo.[user] ([id])

ALTER TABLE dbo.[scheduled_call] ADD CONSTRAINT FK_schedule_call_department FOREIGN KEY ([department_id]) REFERENCES dbo.[department] ([id])

ALTER TABLE dbo.[user_verification] ADD CONSTRAINT FK_user_verification_user FOREIGN KEY ([user_id]) REFERENCES dbo.[user] ([id])