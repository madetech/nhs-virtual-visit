#!/usr/bin/env bash
containerName="${1}"
databaseName="${2}"
username="${3}"
password="${4}"
docker exec -it ${containerName} /opt/mssql-tools/bin/sqlcmd -S localhost -U ${username} -P ${password} -Q "IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${databaseName}')
  BEGIN
    CREATE DATABASE ${databaseName}
END"