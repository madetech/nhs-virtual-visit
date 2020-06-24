#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

$commandPrefix docker-compose exec postgres dropdb nhs-virtual-visit-test -U postgres
$commandPrefix docker-compose exec postgres createdb nhs-virtual-visit-test -U postgres
npm run dbmigratetest up
