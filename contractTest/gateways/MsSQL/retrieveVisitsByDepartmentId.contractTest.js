import retrieveVisitsByDepartmentId from "../../../src/gateways/MsSQL/retrieveVisitsByDepartmentId";
import { setUpScheduledCall, setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveVisitsByDepartmentId", () => {
  const container = AppContainer.getInstance();

  it("returns an object containing the visits when no options is passed", async () => {
    const departmentCreated = {
      code: "WardCodeOne",
    };
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager({
      departmentArgs: { code: departmentCreated.code },
    });

    await setUpScheduledCall({departmentId});

    // Act
    const { error, visits } = await retrieveVisitsByDepartmentId(container)(
      departmentId
    );

    // // Assert
    expect(error).toBeNull();
    expect(visits.length).toEqual(1);
  });
});
