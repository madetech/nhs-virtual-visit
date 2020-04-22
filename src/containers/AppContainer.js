import pgp from "pg-promise";
import createVisit from "../usecases/createVisit";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import { NotifyClient } from "notifications-node-client";

export default class AppContainer {
  getDb() {
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
}
