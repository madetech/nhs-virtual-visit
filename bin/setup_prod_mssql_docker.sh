#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

##################################################################################
## This script is configured to run on Oryx build 								##
## Appsettings variable is required - 			  								##
## POST_BUILD_SCRIPT_PATH pointing to this script 								##
##												  								##
## https://docs.microsoft.com/en-us/azure/app-service/configure-language-python ##
## See section Customize build automation 										##
##################################################################################

echo "Running dbmigrate-prod-mssql.sh project script"

# Before running the script check if server is paused
# Run create / update tables scripts.
for i in $(seq 1 5); do [ $i -gt 1 ] && sleep 15; npm run dbmigrate-prod-mssql up:mssql && s=0 && break || s=$?; done; (exit $s)
