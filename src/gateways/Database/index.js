// Loading and initializing the library:
const pgp = require("pg-promise")({
  // Initialization Options
});

let options = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.NODE_ENV === "test" || process.env.APP_ENV === "test") {
  options.connectionString = process.env.TEST_DATABASE_URL;
}

if (process.env.NODE_ENV === "production") {
  options.ssl = { rejectUnauthorized: false };
}

// from https://www.codeoftheprogrammer.com/2020/01/16/postgresql-from-nextjs-api-route/
const DB_KEY = Symbol.for("MyApp.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = globalSymbols.indexOf(DB_KEY) > -1;

if (!hasDb) {
  global[DB_KEY] = pgp(options);
}

const singleton = {};
Object.defineProperty(singleton, "instance", {
  get: () => global[DB_KEY],
});

// Exporting the database object for shared use:
export default { getInstance: () => singleton.instance };

/*
export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const { default: pgp } = await import("pg-promise");

        let options = {
          connectionString: process.env.DATABASE_URL,
        };

        if (process.env.NODE_ENV === "test" || process.env.APP_ENV === "test") {
          options.connectionString = process.env.TEST_DATABASE_URL;
        }

        if (process.env.NODE_ENV === "production") {
          options.ssl = { rejectUnauthorized: false };
        }

        instance = pgp()(options);
        delete instance.constructor;
      }

      return instance;
    },
  };
})();
 */
