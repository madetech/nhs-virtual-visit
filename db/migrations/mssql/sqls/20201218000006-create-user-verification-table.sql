use nhs_virtual_visit_dev;

CREATE TABLE dbo.[user_verification] (
  [id] int IDENTITY(1, 1),
  [created_at] datetime NOT NULL DEFAULT GETDATE(),
  [user_id] int NOT NULL,
  [type] nvarchar(255) NOT NULL,
  [code] nvarchar(255) NOT NULL,
  [hash] nvarchar(255) NOT NULL,
  [verified] bit DEFAULT 0,
  CONSTRAINT PK_user_verification PRIMARY KEY (id)
)