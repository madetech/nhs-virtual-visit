#!/bin/bash

dropdb nhs-virtual-visit-dev
createdb nhs-virtual-visit-dev
npm run dbmigrate up
