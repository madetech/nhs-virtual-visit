CREATE TABLE dbo.[department] (
  [id] int IDENTITY(1, 1) NOT NULL,
  [name] nvarchar(255) NOT NULL,
  [facility_id] int NOT NULL,
  [created_at] datetime NOT NULL DEFAULT GETDATE(),
  [created_by] int,
  [code] nvarchar(255) NOT NULL,
  [pin] nvarchar(255) NOT NULL,
  [uuid] uniqueidentifier NOT NULL DEFAULT newid(),
  [status] tinyint DEFAULT 0,
  CONSTRAINT PK_department PRIMARY KEY (id)
)