#!/bin/bash

#password is 'postgres'
dropdb -U "postgres" -h "localhost" -p "5432"  nhs-virtual-visit-dev
createdb -U "postgres" -h "localhost" -p "5432"  nhs-virtual-visit-dev
npm run dbmigrate up
# Remove after testing PL
#cat db/seeds.sql | psql -U "postgres" -h "localhost" -p "5432" -d "nhs-virtual-visit-dev"
npm run dbmigrate up:seed