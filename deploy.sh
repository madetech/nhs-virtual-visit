#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

# Check if command runs.
ls -la
ll

# Run create tables scripts.
npm run dbmigrate-prod-mssql up:mssql