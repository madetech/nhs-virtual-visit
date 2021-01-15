IF EXISTS (SELECT * FROM sys.databases WHERE name = 'nhs_virtual_visit_dev')
BEGIN
    DROP DATABASE nhs_virtual_visit_dev;  
END;
CREATE DATABASE nhs_virtual_visit_dev;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'nhs_virtual_visit_test')
BEGIN
    DROP DATABASE nhs_virtual_visit_test;  
END;
CREATE DATABASE nhs_virtual_visit_test;
GO