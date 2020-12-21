ALTER TABLE wards ADD status varchar(20) NOT NULL DEFAULT 'active';

UPDATE wards SET status = 'active';