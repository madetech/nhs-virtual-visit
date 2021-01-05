#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

# Build images from Dockerfile
docker build -t mssql-test:2017-GA-ubuntu docker/mssql/test

# Run container scripts
docker run --name=nhs-virtual-visit-test -p 1433:1433 -d mssql-test:2017-GA-ubuntu

wait_time=10s

# Wait for PostgreSQL Server to come up.
echo waiting database to start in $wait_time...
sleep $wait_time
echo database started...

# Run create tables scripts.
npm run dbmigrate-test-mssql up:mssql
