USE virtual_visits;
GO

CREATE TABLE scheduled_call(
  id INT NOT NULL IDENTITY PRIMARY KEY,
  patient_name nvarchar(max) NOT NULL,
  call_time DATETIME NOT NULL,
  recipient_name nvarchar(max) NOT NULL,
  recipient_number nvarchar(max),
  recipient_email nvarchar(max),
  ward_id int NOT NULL,
  status nvarchar(max) NOT NULL,
  pii_cleared_out DATETIME,
  FOREIGN KEY (ward_id) REFERENCES ward (id)
);
GO
