INSERT INTO trusts (name, admin_code) VALUES ('Test Trust', 'admin');
INSERT INTO trusts (name, admin_code) VALUES ('Test 2 Trust', 'admin2');
INSERT INTO hospitals (name, trust_id) VALUES ('Test Hospital', (SELECT id FROM trusts WHERE name='Test Trust'));
INSERT INTO hospitals (name, trust_id) VALUES ('Test Hospital 2', (SELECT id FROM trusts WHERE name='Test Trust'));
INSERT INTO hospitals (name, trust_id) VALUES ('Test 2 Hospital', (SELECT id FROM trusts WHERE name='Test 2 Trust'));
INSERT INTO wards (name, hospital_id, code, trust_id) VALUES ('Test Ward One', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST1', (SELECT id FROM trusts WHERE name='Test Trust'));
INSERT INTO wards (name, hospital_id, code, trust_id) VALUES ('Test Ward Two', (SELECT id FROM hospitals WHERE name='Test Hospital 2'), 'TEST2', (SELECT id FROM trusts WHERE name='Test Trust'));
INSERT INTO wards (name, hospital_id, code, trust_id) VALUES ('Test 2 Ward One', (SELECT id FROM hospitals WHERE name='Test 2 Hospital'), 'TEST22', (SELECT id FROM trusts WHERE name='Test 2 Trust'));
