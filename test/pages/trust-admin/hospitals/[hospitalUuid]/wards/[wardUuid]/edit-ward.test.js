import { getServerSideProps } from "../../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/edit-ward";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../../../../../src/helpers/userTypes";
describe("/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/edit-ward", () => {
  let res;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });
  describe("getServerSideProps", () => {
    it("redirects to root page if not authenticated", async () => {
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
        Location: "/",
      });
    });
    it("returns ward, hospital, organisation and error as props if authenticated", async () => {
      // Arrange
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const orgId = 10;
      const expectedHospitalUuid = "hospitalUuid";
      const expectedWardUuid = "wardUuid";
      const expectedDepartment = {
        name: "Department One",
        uuid: "department-uuid",
        status: "active",
        code: "DO1",
      };
      const expectedFacility = {
        name: "Facility One",
        uuid: "facility-uuid",
      };
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
      mockAppContainer
        .getTokenProvider()
        .validate.mockImplementationOnce(() => ({
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
      // Act
      const {
        props: { ward, hospital, organisation, error },
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
      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
      expect(retrieveDepartmentByUuidSpy).toHaveBeenCalledWith(
        expectedWardUuid
      );
      expect(retrieveFacilityByUuidSpy).toHaveBeenCalledWith(
        expectedHospitalUuid
      );
      expect(ward).toEqual(expectedDepartment);
      expect(hospital).toEqual(expectedFacility);
      expect(organisation).toEqual(expectedOrganisation);
      expect(error).toBeNull();
    });
  });
});
