import { getServerSideProps } from "../../../../pages/trust-admin/wards/add";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
describe("/trust-admin/wards/add", () => {
  let res;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
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
    it("returns hospitals, hospitalId, organisation and error through props", async () => {
      // Arrange
      const orgId = 10;
      const expectedFacilityId = 1;
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedOrganisationName = "Doggo Trust";
      const expectedFacilities = [
        { id: 1, name: "Hospital1", wards: [{ id: 1, name: "Ward 1" }] },
        { id: 2, name: "Hospital2", wards: [{ id: 2, name: "Ward 2" }] },
      ];
      const tokenProvider = {
        validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: expectedOrganisationName },
        error: null,
      }));
      const retrieveFacilitiesByOrgIdSpy = jest.fn().mockReturnValue({
        facilities: expectedFacilities,
        error: null,
      });
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveFacilitiesByOrgId: () => retrieveFacilitiesByOrgIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const {
        props: { hospitals, hospitalId, organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          hospitalId: expectedFacilityId,
        },
        container,
      });
      // Assert
      expect(retrieveOrganisationByIdSpy).toBeCalledWith(orgId);
      expect(retrieveFacilitiesByOrgIdSpy).toBeCalledWith(orgId);
      expect(hospitals).toEqual(expectedFacilities);
      expect(organisation.name).toEqual(expectedOrganisationName);
      expect(hospitalId).toEqual(expectedFacilityId);
      expect(error).toBeNull();
    });
  });
});
