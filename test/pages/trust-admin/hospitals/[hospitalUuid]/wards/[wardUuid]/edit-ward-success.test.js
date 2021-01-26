import { getServerSideProps } from "../../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/[warduuid]/edit-ward-success";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../../../../../src/helpers/userTypes";

describe("/trust-admin/hospitals/[hospitalUuid]/wards/[warduuid]/edit-ward-success", () => {
  // Arrange
  const orgId = 1;
  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };
  const expectedHospitalUuid = "hospitalUuid";
  const expectedWardUuid = "wardUuid";
  const expectedDepartment = { name: "Department One" };
  const expectedFacility = { name: "Facility One" };
  const expectedOrganisation = { name: "Doggo Trust" };
  const retrieveOrganisationByIdSpy = jest.fn(async () => ({
    organisation: expectedOrganisation,
    error: null,
  }));
  const retrieveDepartmentByUuidSpy = jest.fn().mockReturnValue({
    department: expectedDepartment,
    error: null,
  });
  const retrieveFacilityByUuidSpy = jest.fn().mockReturnValue({
    facility: expectedFacility,
    error: null,
  });
  let res;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    mockAppContainer.getTokenProvider().validate.mockImplementationOnce(() => ({
      type: TRUST_ADMIN,
      trustId: orgId,
    }));
    mockAppContainer.getRetrieveOrganisationById.mockImplementation(
      () => retrieveOrganisationByIdSpy
    );
    mockAppContainer.getRetrieveDepartmentByUuid.mockImplementation(
      () => retrieveDepartmentByUuidSpy
    );
    mockAppContainer.getRetrieveFacilityByUuid.mockImplementation(
      () => retrieveFacilityByUuidSpy
    );
  });
  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      // Arrange
      const anonymousReq = {
        headers: {
          cookie: "",
        },
      };
      // Act
      await getServerSideProps({ req: anonymousReq, res });
      // Assert
      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/login",
      });
    });
    describe("with wardUuid parameter", () => {
      it("retrieves a ward by the wardUuid parameter", async () => {
        // Act
        await getServerSideProps({
          req: authenticatedReq,
          res,
          params: {
            hospitalUuid: expectedHospitalUuid,
            wardUuid: expectedWardUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(retrieveDepartmentByUuidSpy).toHaveBeenCalledWith(
          expectedWardUuid
        );
      });
      it("set a ward prop based on the retrieved ward", async () => {
        // Act
        const {
          props: { name, hospitalName, hospitalUuid, organisation, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          params: {
            hospitalUuid: expectedHospitalUuid,
            wardUuid: expectedWardUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(name).toEqual(expectedDepartment.name);
        expect(organisation).toEqual(expectedOrganisation);
        expect(hospitalName).toEqual(expectedFacility.name);
        expect(hospitalUuid).toEqual(expectedHospitalUuid);
        expect(error).toBeNull();
      });
    });
  });
});
