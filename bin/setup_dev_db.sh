#!/bin/bash

#password is 'postgres'
dropdb -U "postgres" -h "localhost" -p "5432"  nhs-virtual-visit-dev
createdb -U "postgres" -h "localhost" -p "5432"  nhs-virtual-visit-dev

npm run dbmigrate up
npm run dbmigrate up:seed