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

echo "Running Deploy.SH DBMIGRATE project script"

# Run create tables scripts.
npm run dbmigrate-prod-mssql up:mssql