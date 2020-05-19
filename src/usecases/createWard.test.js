import createWard from "./createWard";
import AppContainer from "../containers/AppContainer";
import truncateAllTables from "../testUtils/truncateAllTables";
import setupTrust from "../testUtils/setupTrust";
import setupHospital from "../testUtils/setupHospital";

const container = AppContainer.getInstance();

describe("createWard", () => {
  it("creates a ward in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Ward",
      code: "WardCode",
      trustId: "1",
      hospitalId: "1",
    };

    const { wardId, error } = await createWard(container)(request);

    expect(wardId).toEqual(10);
    expect(error).toBeNull();

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.code,
      request.trustId,
      request.hospitalId,
    ]);
  });

  describe("database test", () => {
    beforeEach(async () => {
      await truncateAllTables(container);
    });

    afterEach(async () => {
      await truncateAllTables(container);

      const db = await container.getDb();
      db.$pool.end();
    });

    it("creates a ward in the db when valid", async () => {
      const trust = await setupTrust(container)({
        name: "Test Trust",
        admin_code: "TEST",
      });

      const hospital = await setupHospital(container)({
        name: "Test Hospital",
        trustId: trust.id,
      });

      const request = {
        name: "Defoe Ward",
        hospitalName: "Test Hospital",
        code: "WardCode",
        trustId: trust.id,
        hospitalId: hospital.id,
      };

      const { wardId, error } = await createWard(container)(request);

      expect(wardId).toBeTruthy;
      expect(error).toBeNull();
    });
  });
});
