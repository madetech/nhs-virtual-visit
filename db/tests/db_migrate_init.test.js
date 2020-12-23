import AppContainer from "../../src/containers/AppContainer";

describe("db-migrate database setup ready", () => {
  const container = AppContainer.getInstance();

  it("do we have an admin user on user table", async () => {
    const pool = await container.getMsSqlConnPool();

    expect(pool).toBeDefined();

    console.log("POOL: ", pool);

    const adminUser = await retrieveAdminUser(pool);

    console.log("POOL: ", pool);

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

    // close resource else blocks process.
    pool.close();
  });

  // TODO create test for organisations, check if the table as more than one record.
});

const retrieveAdminUser = async (pool) => {
  return await pool.query("select * from dbo.[user] where type='admin'");

  //return await pool.request().query("select * from dbo.[user] where type='admin'")
};
