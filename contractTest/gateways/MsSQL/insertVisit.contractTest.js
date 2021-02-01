import AppContainer from "../../../src/containers/AppContainer";
import insertVisit from "../../../src/gateways/MsSQL/insertVisit";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";

describe("insertVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    const db = await container.getMsSqlConnPool();
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const visit = {
      patientName: "Patient Test",
      contactEmail: "test1@testemail.com",
      contactName: "Contact Test",
      contactNumber: "07123456789",
      callTime: new Date(2021, 0, 27, 13, 37, 0, 0),
      callId: "123",
      provider: "whereby",
      callPassword: "securePassword",
    };

    let { id } = await insertVisit(db, visit, departmentId);
    expect(id).toBeGreaterThan(0);
  });
});
