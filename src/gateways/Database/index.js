export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const { default: pgp } = await import("pg-promise");

        instance = pgp()({
          connectionString: process.env.URI,
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
