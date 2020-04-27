import createVisit from "../usecases/createVisit";
import sendTextMessage from "../usecases/sendTextMessage";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import { NotifyClient } from "notifications-node-client";
import { verifyTokenOrRedirect } from "../usecases/verifyToken";

class AppContainer {
  async getDb() {
    const { default: pgp } = await import("pg-promise");

    return pgp()({
      connectionString: process.env.URI,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  getCreateVisit() {
    return createVisit(this);
  }

  getTokenProvider() {
    return new TokenProvider(process.env.JWT_SIGNING_KEY);
  }

  getUserIsAuthenticated() {
    return userIsAuthenticated(this);
  }

  getNotifyClient() {
    const apiKey = process.env.API_KEY;

    return new NotifyClient(apiKey);
  }

  getSendTextMessage() {
    return sendTextMessage(this);
  }

  getVerifyTokenOrRedirect() {
    return verifyTokenOrRedirect;
  }
}

export default (() => {
  let instance;

  return {
    getInstance: () => {
      if (!instance) {
        instance = new AppContainer();
        delete instance.constructor;
      }

      return instance;
    },
  };
})();
