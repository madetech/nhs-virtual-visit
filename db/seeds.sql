INSERT INTO trusts (name, admin_code) VALUES ('Test Trust', 'TRUST1');
INSERT INTO wards (name, hospital_name, code, trust_id) VALUES ('Test Ward One', 'Test Hospital', 'TEST1', (SELECT id FROM trusts WHERE name='Test Trust'));
INSERT INTO wards (name, hospital_name, code, trust_id) VALUES ('Test Ward Two', 'Test Hospital', 'TEST2', (SELECT id FROM trusts WHERE name='Test Trust'));
