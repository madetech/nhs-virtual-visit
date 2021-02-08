ALTER TABLE dbo.[user] DROP CONSTRAINT IF EXISTS FK_user_organisation
ALTER TABLE dbo.[organisation] DROP CONSTRAINT IF EXISTS FK_organisation_user
ALTER TABLE dbo.[facility] DROP CONSTRAINT IF EXISTS FK_facility_organisation
ALTER TABLE dbo.[facility] DROP CONSTRAINT IF EXISTS FK_facility_user
ALTER TABLE dbo.[department] DROP CONSTRAINT IF EXISTS FK_department_facility
ALTER TABLE dbo.[department] DROP CONSTRAINT IF EXISTS FK_department_user
ALTER TABLE dbo.[scheduled_call] DROP CONSTRAINT IF EXISTS FK_schedule_call_department
ALTER TABLE dbo.[user_verification] DROP CONSTRAINT IF EXISTS FK_user_verification_user