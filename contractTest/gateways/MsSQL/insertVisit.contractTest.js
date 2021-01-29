import AppContainer from "../../../src/containers/AppContainer";
import insertVisit from "../../../src/gateways/MsSQL/insertVisit";
import createDepartment from "../../../src/gateways/MsSQL/createDepartment";
import createFacility from "../../../src/gateways/MsSQL/createFacility";
import createOrganisation from "../../../src/gateways/MsSQL/createOrganisation";
import setupUser from "../../../test/testUtils/setupUser";

import Database from "../../../src/gateways/Database";

describe("insertVisit contract tests", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    const db = await container.getMsSqlConnPool();
    const { id: userId } = await setupUser({ //Uuuh why isn't this being cleared from the database?
      getMsSqlConnPool: () => db
    })({
      email: "default@example.com",
      password: "testpassword",
      type: "Default" //needs an organisation even before we make one... weird
    });

    const { organisation: { id: orgId } } = await createOrganisation({
      getMsSqlConnPool: () => db
    })({
      name: "Base Org",
      type: "Default",
      createdBy: userId,
    });
    
    const { id: facilityId } = await createFacility({
      getMsSqlConnPool: () => db
    })({
      name: "Base Facility",
      orgId: orgId,
      code: "BXY",
      createdBy: userId,
    });
    /*
    
    await createDepartment({
      getMsSqlConnPool: () => db
    })({
      name: "Base", //department name
      code: "BXY", //department code
      facilityId: facilityId, //facility, previously called a trust
      pin: "1415", //department pin
      createdBy: userId, //we can use setupUser for this, it has the code we need
    });
    
    const wardId = 25565; //We don't need to use a real ward id, so long as it's not null

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
    let { id } = await insertVisit(db, visit, wardId);
    expect(id).toBeGreaterThan(0);
    */
  });
});
