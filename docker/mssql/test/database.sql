ALTER AUTHORIZATION ON DATABASE::nhs_virtual_visit_test TO sa;

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'nhs_virtual_visit_test')
BEGIN
    DROP DATABASE nhs_virtual_visit_test;
END;
CREATE DATABASE nhs_virtual_visit_test;
GO