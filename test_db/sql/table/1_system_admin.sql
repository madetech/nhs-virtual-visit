USE virtual_visits;
GO

CREATE TABLE system_admin (
  id INT NOT NULL IDENTITY PRIMARY KEY,
  username nvarchar(max) NOT NULL,
  password nvarchar(max) NOT NULL
);
GO
