USE virtual_visits;
GO

CREATE TABLE auth(
  id INT NOT NULL IDENTITY PRIMARY KEY,
  name nvarchar(max) NOT NULL,
  created_at DATETIME DEFAULT(getdate()),
  email nvarchar(max) NOT NULL,
  password nvarchar(max) NOT NULL,
);
GO
