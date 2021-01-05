const sql = require("mssql");

const TEST_MSSQL = "test-mssql";

function setPoolConfigPerEnvironment(config) {
  if (
    process.env.NODE_ENV === TEST_MSSQL ||
    process.env.APP_ENV === TEST_MSSQL
  ) {
    console.log("MSSQL::TEST::CONFIG");

    // config.user = process.env.MSQL_TEST_DB_USER;
    // config.password = process.env.MSQL_TEST_DB_PASSWORD;
    // config.server = process.env.MSQL_TEST_DB_SERVER;
    // config.database = process.env.MSQL_TEST_DB_NAME;

    config.user = "sa";
    config.password = "P@55w0rd";
    config.server = "localhost";
    config.database = "nhs_virtual_visit_test";
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

  console.log("MSSQL::CONFIG::", config);

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
