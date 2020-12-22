use nhs_virtual_visit_dev;

CREATE TABLE dbo.[scheduled_call] (
  [id] int IDENTITY(1, 1) NOT NULL,
  [patient_name] nvarchar(255),
  [call_time] datetime,
  [pii_cleared_out] datetime,
  [recipient_name] nvarchar(255),
  [recipient_number] nvarchar(255),
  [recipient_email] nvarchar(255),
  [department_id] int NOT NULL,
  [uuid] uniqueidentifier NOT NULL DEFAULT newid(),
  [status] tinyint DEFAULT 0,
  CONSTRAINT PK_scheduled_call PRIMARY KEY (id)
)