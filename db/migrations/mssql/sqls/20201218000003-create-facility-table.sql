CREATE TABLE dbo.[facility] (
  [id] int IDENTITY(1, 1) NOT NULL,
  [name] nvarchar(255) NOT NULL,
  [organisation_id] int NOT NULL,
  [created_at] datetime NOT NULL DEFAULT GETDATE(),
  [created_by] int NOT NULL,
  [code] nvarchar(255) NOT NULL,
  [uuid] uniqueidentifier NOT NULL DEFAULT newid(),
  [status] tinyint DEFAULT 0,
  CONSTRAINT PK_facility PRIMARY KEY (id)
)