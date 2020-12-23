const sql = require("mssql");

const DEV_MSSQL = "development-mssql";
const E2E_MSSQL = "e2e-mssql";

function setPoolConfigPerEnvironment(config) {
  if (process.env.NODE_ENV === DEV_MSSQL || process.env.APP_ENV === DEV_MSSQL) {
    config.user = process.env.MSQL_DEV_DB_USER;
    config.password = process.env.MSQL_DEV_DB_PASSWORD;
    config.server = process.env.MSQL_DEV_DB_SERVER;
    config.database = process.env.MSQL_DEV_DB_DATABASE;
  } else if (
    process.env.NODE_ENV === E2E_MSSQL ||
    process.env.APP_ENV === E2E_MSSQL
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
    options: {
      encrypt: true,
      validateBulkLoadParameters: false,
      truestedConnection: true,
      enableArithAbort: true,
      integratedSecurity: true,
      trustServerCertificate: true,
      rowCollectionOnDone: true,
    },
  };

  console.log("CONFIG:  ", config);

  setPoolConfigPerEnvironment(config);

  const DB_KEY = Symbol.for("MyApp.db");
  const globalSymbols = Object.getOwnPropertySymbols(global);
  const hasDb = globalSymbols.indexOf(DB_KEY) > -1;

  if (!hasDb) {
    return (global[DB_KEY] = await sql.connect(config));
  } else {
    return global[DB_KEY];
  }
}

export default { getConnectionPool: () => initPool() };
