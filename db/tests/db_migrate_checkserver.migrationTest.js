import AppContainer from "../../src/containers/AppContainer";

describe("db-migrate database setup ready", () => {
  const container = AppContainer.getInstance();

  it("do we have an admin user on user table", async () => {
    const db = await container.getMsSqlConnPool();
    const adminUser = await retrieveAdminUser(db);

    expect(adminUser).toBeDefined();
    expect(adminUser.recordset).toBeDefined();
    expect(adminUser.recordset).toMatchObject([
      {
        id: expect.any(Number),
        email: expect.stringContaining("@nhs.co.uk"),
        password: expect.any(String),
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

  it("do we have organisations on organisation table", async () => {
    const db = await container.getMsSqlConnPool();
    const orgs = await retrieveOrganisations(db);

    expect(orgs).toBeDefined();
    expect(orgs.recordset).toBeDefined();
    expect(orgs.recordset).toContainEqual(
      expect.objectContaining({ totalOrgs: expect.any(Number) })
    );
  });
});

const retrieveAdminUser = async (db) => {
  return await db
    .request()
    .query("select * from dbo.[user] where type='admin'");
};

const retrieveOrganisations = async (db) => {
  return await db
    .request()
    .query("select count(*) as 'totalOrgs' from dbo.[organisation]");
};
