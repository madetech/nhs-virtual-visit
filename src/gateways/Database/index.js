export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const { default: pgp } = await import("pg-promise");

        instance = pgp()({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        });
        delete instance.constructor;
      }

      return instance;
    },
  };
})();
