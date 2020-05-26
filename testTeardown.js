import AppContainer from "./src/containers/AppContainer";
afterAll(async () => {
  const container = AppContainer.getInstance();
  const db = await container.getDb();
  db.$pool.end();
});
