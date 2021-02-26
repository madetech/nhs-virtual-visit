import AppContainer from "../../../src/containers/AppContainer";
import insertVisit from "../../../src/gateways/MsSQL/insertVisit";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import { v4 as uuidv4 } from 'uuid'

describe("insertVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const callId = uuidv4();

    const visit = {
      patientName: "Patient Test",
      contactEmail: "test1@testemail.com",
      contactName: "Contact Test",
      contactNumber: "07123456789",
      callTime: new Date(2021, 0, 27, 13, 37, 0, 0),
      callId
    };

    const { id, uuid, error } = await insertVisit(container)(
      visit,
      departmentId
    );
    expect(error).toBeNull();
    expect(id).toBeGreaterThan(0);
    expect(uuid).toEqual(callId.toUpperCase());
  });

  it("catches errors", async () => {
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const visit = null;

    let { error } = await insertVisit(container)(visit, departmentId);
    expect(error).toEqual(
      "TypeError: Cannot read property 'patientName' of null"
    );
  });
});
