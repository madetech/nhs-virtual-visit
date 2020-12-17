USE virtual_visits;
GO

CREATE TABLE hospital(
  id INT NOT NULL IDENTITY PRIMARY KEY,
  name nvarchar(max) NOT NULL,
  created_at DATETIME DEFAULT(getdate()),
  trust_id int NOT NULL,
  survey_url nvarchar(max),
  support_url nvarchar(max),
  FOREIGN KEY (trust_id) REFERENCES trust (id)
);
GO
