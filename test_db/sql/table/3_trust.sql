USE virtual_visits;
GO

CREATE TABLE trust(
  id INT NOT NULL IDENTITY PRIMARY KEY,
  name nvarchar(max) NOT NULL,
  created_at DATETIME DEFAULT(getdate()),
  trust_admin_id int NOT NULL,
  video_provider nvarchar(max) NOT NULL,
  FOREIGN KEY (trust_admin_id) REFERENCES auth (id)
);
GO
