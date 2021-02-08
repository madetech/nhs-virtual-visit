import AppContainer from "./src/containers/AppContainer";
import truncateAllMsSQLTables from "./test/testUtils/truncateAllMsSQLTables.js";

const container = AppContainer.getInstance();

beforeAll(async () => {
  //await truncateAllTables(container);
  await truncateAllMsSQLTables(container);
});

afterEach(async () => {
  //await truncateAllTables(container);
  await truncateAllMsSQLTables(container);
});

afterAll(async () => {
  const mssqlPool = await container.getMsSqlConnPool();
  mssqlPool.close();
});
