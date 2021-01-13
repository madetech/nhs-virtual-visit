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

echo "Running Remove Deploy.sh script from wwwroot"

# Remove deploy.sh file from home/site/wwwroot
