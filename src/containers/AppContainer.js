import pgp from "pg-promise";
import createVisit from "../usecases/createVisit";

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
}
