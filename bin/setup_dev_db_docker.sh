#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

cd docker/pg
docker-compose up -d postgres

wait_time=10

# wait for PostgreSQL Server to come up
echo waiting database to start in $(eval echo $wait_time)s...
for i in $(eval echo {$wait_time..01})
do
tput cup 4 $l
echo -n "$i"
sleep 1
done
echo
echo database started...

$commandPrefix docker exec postgres dropdb nhs-virtual-visit-dev -U postgres --if-exists
$commandPrefix docker exec postgres createdb nhs-virtual-visit-dev -U postgres
npm run dbmigrate up
$commandPrefix docker exec postgres psql nhs-virtual-visit-dev -U postgres -f /db/seeds.sql

exec $SHELL
