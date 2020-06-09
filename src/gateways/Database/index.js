export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const { default: pgp } = await import("pg-promise");

        let options = {
          connectionString: process.env.DATABASE_URL,
        };

        if (process.env.NODE_ENV === "test" || process.env.ENV === "test") {
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
