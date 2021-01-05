#!/bin/bash

# run the database script to create the DB
/opt/mssql-tools/bin/sqlcmd -S 0.0.0.0 -U sa -P P@55w0rd -d master -i ./database.sql