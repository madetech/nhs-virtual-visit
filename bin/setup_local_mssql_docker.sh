#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

# Start docker yml from path and detached.
docker-compose -f docker/mssql/local/docker-compose.yml up -d

wait_time=5s

# Wait for PostgreSQL Server to come up.
echo waiting database to start in $wait_time...
sleep $wait_time
echo database started...

# Run create tables scripts.
npm run dbmigrate-dev-mssql up:mssql