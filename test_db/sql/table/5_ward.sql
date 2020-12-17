USE virtual_visits;
GO

CREATE TABLE ward(
  id INT NOT NULL IDENTITY PRIMARY KEY,
  name nvarchar(max) NOT NULL,
  created_at DATETIME DEFAULT(getdate()),
  hospital_id int NOT NULL,
  ward_code nvarchar(max) NOT NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospital (id)
);
GO
