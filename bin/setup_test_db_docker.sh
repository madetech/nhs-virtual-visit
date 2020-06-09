#!/bin/bash

sudo docker-compose exec postgres dropdb nhs-virtual-visit-test -U postgres
sudo docker-compose exec postgres createdb nhs-virtual-visit-test -U postgres
npm run dbmigratetest up
