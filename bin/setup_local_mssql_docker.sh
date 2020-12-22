#!/bin/bash

wait_time=15

cd docker 
docker-compose up -d 

# wait for SQL Server to come up
echo waiting database to start in $(eval echo $wait_time)s...
for i in $(eval echo {$wait_time..01})
do
tput cup 4 $l
echo -n "$i"
sleep 1
done
echo
echo database started...

cd ..
echo start running migrations...
npm run dbmigrate-up-local 
echo end running migrations...