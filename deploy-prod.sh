#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

echo "Running Deploy-Prod.SH DBMIGRATE project script"

# Install project on docker.
npm install

# Run create tables scripts.
npm run dbmigrate-prod-mssql up:mssql