CREATE TABLE dbo.[organisation] (
  [id] int IDENTITY(1, 1) NOT NULL,
  [name] nvarchar(255),
  [created_at] datetime DEFAULT GETDATE(),
  [created_by] int,
  [type] nvarchar(255) NOT NULL,
  [uuid] uniqueidentifier NOT NULL DEFAULT newid(),
  [status] tinyint DEFAULT 0,
  CONSTRAINT PK_organisation PRIMARY KEY (id)
)