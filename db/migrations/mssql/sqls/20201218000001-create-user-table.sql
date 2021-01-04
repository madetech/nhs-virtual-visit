CREATE TABLE dbo.[user] (
  [id] int IDENTITY(1, 1) NOT NULL,
  [email] nvarchar(255) NOT NULL,
  [password] nvarchar(255) NOT NULL,
  [created_at] datetime NOT NULL DEFAULT GETDATE(),
  [updated_at] datetime NOT NULL DEFAULT GETDATE(),
  [type] nvarchar(255) NOT NULL,
  [organisation_id] int,
  [uuid] uniqueidentifier NOT NULL DEFAULT newid(),
  [change_password] bit DEFAULT 0,
  [status] tinyint DEFAULT 0,
  CONSTRAINT PK_user PRIMARY KEY (id),
  CONSTRAINT UN_email UNIQUE ([email]) 
)