#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

# Build images from Dockerfile
docker build -t mssql-test:2017-GA-ubuntu ./docker/mssql/test

# Run container scripts
docker run --name=nhs-virtual-visit-test -p 1433:1433 -d mssql-test:2017-GA-ubuntu | xargs docker logs -f

# Run create tables scripts.
npm run dbmigrate-test-mssql up:mssql
