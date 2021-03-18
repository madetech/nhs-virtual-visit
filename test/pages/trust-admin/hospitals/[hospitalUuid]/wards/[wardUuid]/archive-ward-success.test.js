import { getServerSideProps } from "../../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/archive-ward-success";
import { TRUST_ADMIN } from "../../../../../../../src/helpers/userTypes";
describe("/trust-admin/wards/archive-success", () => {
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
    it("returns hospitals, hospitalId, organisation and error through props", async () => {
      // Arrange
      const orgId = 10;
      const expectedDepartment = {
        name: "Ward1",
        uuid: "department-uuid",
      };
      const expectedFacility = {
        name: "Hospital1",
        uuid: "hospitalUuid",
      };
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedOrganisationName = "Doggo Trust";
      const tokenProvider = {
        validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: expectedOrganisationName },
        error: null,
      }));
      const retrieveDepartmentByUuidSpy = jest.fn(async () => ({
        department: {
          name: expectedDepartment.name,
          uuid: expectedDepartment.uuid,
        },
        error: null,
      }));
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveDepartmentByUuid: () => retrieveDepartmentByUuidSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const {
        props: { ward, hospital, organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          hospitalName: expectedFacility.name,
        },
        params: {
          hospitalUuid: expectedFacility.uuid,
          wardUuid: expectedDepartment.uuid,
        },
        container,
      });
      // Assert
      expect(retrieveOrganisationByIdSpy).toBeCalledWith(orgId);
      expect(organisation.name).toEqual(expectedOrganisationName);
      expect(hospital).toEqual(expectedFacility);
      expect(ward).toEqual(expectedDepartment);
      expect(error).toBeNull();
    });
  });
});
