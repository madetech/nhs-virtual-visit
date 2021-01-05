import AppContainer from "./src/containers/AppContainer";
import truncateAllTables from "./test/testUtils/truncateAllTables";

const container = AppContainer.getInstance();

beforeAll(async () => {
  await truncateAllTables(container);
});

afterEach(async () => {
  await truncateAllTables(container);
});

afterAll(async () => {
  // TODO Remove after migration to MSSQL
  const db = await container.getDb();
  db.$pool.end();

  const mssqlPool = await container.getMsSqlConnPool();
  mssqlPool.close();
});
