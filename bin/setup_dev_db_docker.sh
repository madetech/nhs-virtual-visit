#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

$commandPrefix docker-compose exec postgres dropdb nhs-virtual-visit-dev -U postgres
$commandPrefix docker-compose exec postgres createdb nhs-virtual-visit-dev -U postgres
npm run dbmigrate up
$commandPrefix docker-compose exec postgres psql nhs-virtual-visit-dev -U postgres -f /db/seeds.sql
