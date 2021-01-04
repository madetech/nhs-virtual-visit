#!/bin/bash
cat << EOF > database.json
{
"test-mssql": {
    "driver": "mssql",
    "user": "sa",
    "password": "abcdef",
    "server": "localhost",
    "database": "nhs_virtual_visit_dev",
    "port": 1433,
    "options": {
      "encrypt": true,
      "validateBulkLoadParameters": false,
      "trustedConnection": true,
      "enableArithAbort": true,
      "integratedSecurity": true,
      "trustServerCertificate": true,
      "rowCollectionOnDone": true
    },
    "pool": {
      "max": 15,
      "min": 5,
      "idleTimeoutMillis": 30000
    }
  },
  "sql-file": true
}
EOF

echo "Database json file written"
wc -c database.json
