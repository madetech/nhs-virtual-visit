#!/usr/bin/env bash

function createDB() {
  databaseName="${1}"
  username="${2}"
  password="${3}"
  docker exec -it nhs-virtual-visit /opt/mssql-tools/bin/sqlcmd -S localhost -U ${username} -P ${password} -Q "IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${databaseName}')
    BEGIN
      CREATE DATABASE ${databaseName}
  END"
}

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

# Start docker yml from path and detached.
$commandPrefix docker-compose -f docker/mssql/local/docker-compose.yml up -d

wait_time=15s

# Wait for PostgreSQL Server to come up.
echo waiting database to start in $wait_time...
sleep $wait_time
echo database started...

# Create Databases
if [ -f .env ]; then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

createDB ${MSQL_DB_NAME} ${MSQL_DB_USER} ${MSQL_DB_PASSWORD}
createDB ${MSQL_TEST_DB_NAME} ${MSQL_TEST_DB_USER} ${MSQL_TEST_DB_PASSWORD}

# Run create tables scripts.
npm run dbmigratedev up:mssql
npm run dbmigratetest up:mssql