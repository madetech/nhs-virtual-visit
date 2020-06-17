import { NotifyClient } from "notifications-node-client";

import { NotifyClient as FakeNotifyClient } from "../../../__mocks__/notifications-node-client";

export default (() => {
  let instance;

  return {
    getInstance: async () => {
      if (!instance) {
        const apiKey = process.env.API_KEY;

        if (process.env.APP_ENV === "test") {
          instance = new FakeNotifyClient(apiKey);
        } else {
          instance = new NotifyClient(apiKey);
        }

        delete instance.constructor;
      }

      return instance;
    },
  };
})();
