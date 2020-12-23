import AppContainer from "../../src/containers/AppContainer";

const container = AppContainer.getInstance();
let pool;

beforeAll(async () => {
  pool = await container.getMsSqlConnPool();
});

afterAll(async () => {
  // Close pool after tests are done.
  pool.close();
});

describe("db-migrate database setup ready", () => {
  it("do we have an admin user on user table", async () => {
    pool = await container.getMsSqlConnPool();

    expect(pool).toBeDefined();

    const adminUser = await retrieveAdminUser(pool);

    expect(adminUser).toBeDefined();
    expect(adminUser.recordset).toBeDefined();
    expect(adminUser.recordset).toMatchObject([
      {
        id: expect.any(Number),
        email: expect.stringContaining("@nhs.co.uk"),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        type: "admin",
        organisation_id: null,
        uuid: expect.stringMatching(
          /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/
        ),
        change_password: false,
        status: 1,
      },
    ]);
  });

  it("do we have organisations on organisarion table", async () => {
    pool = await container.getMsSqlConnPool();

    expect(pool).toBeDefined();

    const countOrgs = await retrieveOrganisations(pool);

    expect(countOrgs).toBeDefined();
    expect(countOrgs.recordset).toBeDefined();
    expect(countOrgs.recordset[0].count).toBeGreaterThan(0);
  });
});

const retrieveAdminUser = async (pool) => {
  return await pool
    .request()
    .query("select * from [dbo].[user] where type='admin'");
};

const retrieveOrganisations = async (pool) => {
  return await pool
    .request()
    .query("select count(id) as 'count' FROM [dbo].[organisation]");
};
