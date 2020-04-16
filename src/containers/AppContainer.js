import pgp from "pg-promise";
import createVisitation from "../usecases/createVisitation";

export default class AppContainer {
  getDb() {
    return pgp()({
      connectionString: process.env.URI,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  getCreateVisitation() {
    return createVisitation(this);
  }
}
