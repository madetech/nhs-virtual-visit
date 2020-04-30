import createVisit from "../usecases/createVisit";
import createWard from "../usecases/createWard";
import sendTextMessage from "../usecases/sendTextMessage";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import adminIsAuthenticated from "../usecases/adminIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import { NotifyClient } from "notifications-node-client";
import { verifyTokenOrRedirect } from "../usecases/verifyToken";
import Database from "../gateways/Database";
import retrieveWardById from "../usecases/retrieveWardById";
import verifyWardCode from "../usecases/verifyWardCode";
import retrieveVisits from "../usecases/retrieveVisits";
import retrieveVisitByCallId from "../usecases/retrieveVisitByCallId";

class AppContainer {
  getDb() {
    return Database.getInstance();
  }

  getCreateVisit() {
    return createVisit(this);
  }

  getCreateWard() {
    return createWard(this);
  }

  getWardById() {
    return retrieveWardById(this);
  }

  getTokenProvider() {
    return new TokenProvider(process.env.JWT_SIGNING_KEY);
  }

  getUserIsAuthenticated() {
    return userIsAuthenticated(this);
  }

  getAdminIsAuthenticated() {
    return adminIsAuthenticated(this);
  }

  getNotifyClient() {
    const apiKey = process.env.API_KEY;

    return new NotifyClient(apiKey);
  }

  getSendTextMessage() {
    return sendTextMessage(this);
  }

  getVerifyWardCode() {
    return verifyWardCode(this);
  }

  getRetrieveVisits() {
    return retrieveVisits(this);
  }

  getRetrieveVisitByCallId() {
    return retrieveVisitByCallId(this);
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
