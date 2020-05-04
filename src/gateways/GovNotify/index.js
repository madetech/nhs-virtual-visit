import { NotifyClient } from "notifications-node-client";

export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const apiKey = process.env.API_KEY;

        instance = new NotifyClient(apiKey);

        delete instance.constructor;
      }

      return instance;
    },
  };
})();
