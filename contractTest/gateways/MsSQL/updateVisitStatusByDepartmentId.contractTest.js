import retrieveVisitsByDepartmentId from "../../../src/gateways/MsSQL/retrieveVisitsByDepartmentId";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import insertVisit from "../../../src/gateways/MsSQL/insertVisit";
import updateVisitStatusByDepartmentId from "../../../src/gateways/MsSQL/updateVisitStatusByDepartmentId";
import { statusToId, ARCHIVED } from "../../../src/helpers/visitStatus";

describe("updateVisitStatusByDepartmentId", () => {
  const container = AppContainer.getInstance();

  it("updates all visits in a department with an archived status", async () => {
    const departmentCreated = {
      code: "WardCodeOne",
    };
    const {
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager({
      departmentArgs: { code: departmentCreated.code },
    });

    const db = await container.getMsSqlConnPool();
    await insertVisit(db, {}, departmentId);
    await insertVisit(db, {}, departmentId);
    await insertVisit(db, {}, departmentId);
    await insertVisit(db, {}, departmentId);

    const updated = await updateVisitStatusByDepartmentId(container)({
      departmentId,
      status: statusToId(ARCHIVED),
    });

    expect(updated.error).toBeNull();

    const { error, visits } = await retrieveVisitsByDepartmentId(container)(
      departmentId
    );

    console.log(visits);

    const archived = visits.filter((v) => v.status === statusToId(ARCHIVED));

    // // Assert
    expect(error).toBeNull();
    expect(visits.length).toEqual(archived.length);
  });
});
