#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

echo "Running Deploy.SH DBMIGRATE project script"

# Run create tables scripts.
npm run dbmigrate-prod-mssql up:mssql