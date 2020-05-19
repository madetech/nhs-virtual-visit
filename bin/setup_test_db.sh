#!/bin/bash

dropdb nhs-virtual-visit-test
createdb nhs-virtual-visit-test
npm run dbmigratetest up
