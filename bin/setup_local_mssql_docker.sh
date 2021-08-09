#!/usr/bin/env bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

containerName="nhs-virtual-visit"

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

bin/createDatabaseInDocker.sh ${containerName} ${MSQL_DB_NAME} ${MSQL_DB_USER} ${MSQL_DB_PASSWORD}
bin/createDatabaseInDocker.sh ${containerName} ${MSQL_TEST_DB_NAME} ${MSQL_TEST_DB_USER} ${MSQL_TEST_DB_PASSWORD}

# Run create tables scripts.
npm run dbmigratedev up:mssql
npm run dbmigratetest up:mssql