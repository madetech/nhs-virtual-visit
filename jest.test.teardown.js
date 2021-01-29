import AppContainer from "./src/containers/AppContainer";
import truncateAllTables from "./test/testUtils/truncateAllTables";
import truncateAllMsSQLTables from "./test/testUtils/truncateAllMsSQLTables.js";

const container = AppContainer.getInstance();

beforeAll(async () => {
  await truncateAllTables(container);
  await truncateAllMsSQLTables(container);
});

afterEach(async () => {
  await truncateAllTables(container);
  await truncateAllMsSQLTables(container);
});

afterAll(async () => {
  // TODO Remove after migration to MSSQL
  const db = await container.getDb();
  db.$pool.end();

  const mssqlPool = await container.getMsSqlConnPool();
  mssqlPool.close();
});
