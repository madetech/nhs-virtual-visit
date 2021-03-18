import { getServerSideProps } from "../../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/archive-ward-confirmation";
import { TRUST_ADMIN } from "../../../../../../../src/helpers/userTypes";
describe("/trust-admin/wards/[id]/archive-confirmation", () => {
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
    it("returns error, id, name hospitalName organisation and hospitalId as props", async () => {
      // Arrange
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedOrgId = 1;
      const expectedOrganisationName = "Doggo Trust";
      const expectedFacilityName = "Hospital One";
      const expectedFacilityUuid = "hospital-uuid";
      const expectedDepartment = {
        id: 1,
        uuid: "deparment-uuid",
        name: "Defoe Ward",
        facilityId: 2,
      };
      const tokenProvider = {
        validate: jest.fn(() => ({
          type: TRUST_ADMIN,
          trustId: expectedOrgId,
        })),
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: expectedOrganisationName },
        error: null,
      }));

      const retrieveDepartmentByUuidSpy = jest.fn().mockReturnValue({
        department: expectedDepartment,
        error: null,
      });
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveDepartmentByUuid: () => retrieveDepartmentByUuidSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const {
        props: { ward, organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        params: {
          wardUuid: expectedDepartment.uuid,
          hospitalUuid: expectedFacilityUuid,
        },
        query: {
          hospitalName: expectedFacilityName,
        },
        container,
      });
      // Assert
      expect(retrieveDepartmentByUuidSpy).toHaveBeenCalledWith(
        expectedDepartment.uuid
      );
      expect(organisation.name).toEqual(expectedOrganisationName);
      expect(ward).toEqual(expectedDepartment);
      expect(error).toBeNull();
    });
  });
});
