import pgp from "pg-promise";
import createVisit from "../usecases/createVisit";
import getDatabase from "../gateways/databaseGateway";

export default class AppContainer {
  getDb() {
    return getDatabase();
  }

  getCreateVisit() {
    return createVisit(this);
  }
}
