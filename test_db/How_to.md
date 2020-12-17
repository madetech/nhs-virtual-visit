Run docker-compose up

Access the test container
docker exec -it test_db_mssql_1 "bash"

Use sqlcmd to access the DB
opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P P@55w0rd

Change to the virtual_visits db
USE virtual_visits
GO

Execute queries
SELECT \* FROM auth
GO
