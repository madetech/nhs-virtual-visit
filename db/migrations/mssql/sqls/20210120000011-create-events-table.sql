CREATE TABLE dbo.[events] (
  [id] int IDENTITY(1, 1) NOT NULL,
  [created_at] datetime,
  [action] nvarchar(255),
  [scheduled_call_id] int,
  [session_id] uniqueidentifier NOT NULL DEFAULT newid(),
  CONSTRAINT PK_events PRIMARY KEY (id)
)

ALTER TABLE dbo.[events] ADD CONSTRAINT FK_events_scheduled_call FOREIGN KEY ([scheduled_call_id]) REFERENCES dbo.[scheduled_call] ([id])
