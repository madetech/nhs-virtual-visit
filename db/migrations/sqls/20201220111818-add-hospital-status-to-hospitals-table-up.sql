ALTER TABLE hospitals ADD status varchar(20) NOT NULL DEFAULT 'active';

UPDATE hospitals SET status = 'active';