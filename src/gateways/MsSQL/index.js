const sql = require("mssql");

const TEST_E2E_MSSQL = "test-e2e-mssql";

function setPoolConfigPerEnvironment(config) {
  if (
    process.env.NODE_ENV === TEST_E2E_MSSQL ||
    process.env.APP_ENV === TEST_E2E_MSSQL
  ) {
    config.user = process.env.MSQL_E2E_DB_USER;
    config.password = process.env.MSQL_E2E_DB_PASSWORD;
    config.server = process.env.MSQL_E2E_DB_SERVER;
    config.database = process.env.MSQL_E2E_DB_DATABASE;
  }
}

async function initPool() {
  let config = {
    driver: process.env.MSQL_DB_USER,
    user: process.env.MSQL_DB_USER,
    password: process.env.MSQL_DB_PASSWORD,
    server: process.env.MSQL_DB_SERVER,
    database: process.env.MSQL_DB_DATABASE,
    port: process.env.MSQL_DB_PORT,
    options: {
      encrypt: true,
      validateBulkLoadParameters: false,
      trustedConnection: true,
      enableArithAbort: true,
      integratedSecurity: true,
      trustServerCertificate: true,
      rowCollectionOnDone: true,
    },
    pool: {
      max: process.env.MSQL_DB_POOL_MAX,
      min: process.env.MSQL_DB_POOL_MIN,
      idleTimeoutMillis: process.env.MSQL_DB_POOL_IDLE_TIMEOUT,
    },
  };

  setPoolConfigPerEnvironment(config);

  const DB_KEY = Symbol.for("MsSQL.db");
  const globalSymbols = Object.getOwnPropertySymbols(global);
  const hasDb = globalSymbols.indexOf(DB_KEY) > -1;

  if (!hasDb) {
    return (global[DB_KEY] = await sql.connect(config));
  } else {
    return global[DB_KEY];
  }
}

export default { getConnectionPool: () => initPool() };
