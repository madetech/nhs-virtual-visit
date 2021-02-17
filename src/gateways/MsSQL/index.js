const sql = require("mssql");

const TEST_MSSQL = "test";

function setPoolConfigPerEnvironment(config) {
  if (
    (process.env.NODE_ENV !== undefined &&
      process.env.NODE_ENV.indexOf(TEST_MSSQL)) !== -1 ||
    (process.env.APP_ENV !== undefined &&
      process.env.APP_ENV.indexOf(TEST_MSSQL) !== -1)
  ) {
    config.user = process.env.MSQL_TEST_DB_USER;
    config.password = process.env.MSQL_TEST_DB_PASSWORD;
    config.server = process.env.MSQL_TEST_DB_SERVER;
    config.database = process.env.MSQL_TEST_DB_NAME;
  }
}

async function initPool() {
  let config = {
    driver: process.env.MSQL_DB_DRIVER,
    user: process.env.MSQL_DB_USER,
    password: process.env.MSQL_DB_PASSWORD,
    server: process.env.MSQL_DB_SERVER,
    database: process.env.MSQL_DB_NAME,
    port: process.env.MSQL_DB_PORT * 1,
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
      max: process.env.MSQL_DB_POOL_MAX * 1,
      min: process.env.MSQL_DB_POOL_MIN * 1,
      idleTimeoutMillis: process.env.MSQL_DB_POOL_IDLE_TIMEOUT * 1,
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
