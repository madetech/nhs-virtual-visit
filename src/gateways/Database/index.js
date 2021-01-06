// Loading and initializing the library:
const pgp = require("pg-promise")({
  // Initialization Options
});

let options = {
  connectionString: process.env.PG_DB_URL,
};

if (
  (process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV.indexOf("test") !== -1) ||
  (process.env.APP_ENV !== undefined &&
    process.env.APP_ENV.indexOf("test") !== -1)
) {
  options.connectionString = process.env.PG_TEST_DB_URL;
}

// from https://www.codeoftheprogrammer.com/2020/01/16/postgresql-from-nextjs-api-route/
const DB_KEY = Symbol.for("MyApp.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = globalSymbols.indexOf(DB_KEY) > -1;

if (!hasDb) {
  global[DB_KEY] = pgp(options);
}

export default { getInstance: () => global[DB_KEY] };
