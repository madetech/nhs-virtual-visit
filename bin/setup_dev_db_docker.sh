#!/bin/bash

sudo docker-compose exec postgres dropdb nhs-virtual-visit-dev -U postgres
sudo docker-compose exec postgres createdb nhs-virtual-visit-dev -U postgres
npm run dbmigrate up
sudo docker-compose exec postgres psql nhs-virtual-visit-dev -U postgres -f /db/seeds.sql
