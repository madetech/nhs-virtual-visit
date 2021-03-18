import { getServerSideProps } from "../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/add-ward";
import { TRUST_ADMIN } from "../../../../../../src/helpers/userTypes";
import mockAppContainer from "src/containers/AppContainer";

describe("/trust-admin/hospitals/[hospitalUuid]/wards/add-ward", () => {
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
    it("returns hospital, organisation and error through props", async () => {
      // Arrange
      const orgId = 10;
      const expectedFacilityId = 1;
      const expectedFacilityUuid = "uuid";
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedOrganisationName = "Doggo Trust";
      const expectedFacility = {
        id: expectedFacilityId,
        uuid: expectedFacilityUuid,
        name: "Hospital1",
      };

      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: expectedOrganisationName },
        error: null,
      }));
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
      mockAppContainer.getRetrieveOrganisationById.mockImplementationOnce(
        () => retrieveOrganisationByIdSpy
      );
      mockAppContainer.getRetrieveFacilityByUuid.mockImplementationOnce(
        () => retrieveFacilityByUuidSpy
      );

      // const container = {
      //   getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
      //   getRetrieveFacilitiesByOrgId: () => retrieveFacilitiesByOrgIdSpy,
      //   getTokenProvider: () => tokenProvider,
      //   getRegenerateToken: () => jest.fn().mockReturnValue({}),
      // };
      // Act
      const {
        props: { hospital, organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        params: {
          hospitalUuid: expectedFacilityUuid,
        },
        container: { ...mockAppContainer },
      });
      // Assert
      expect(retrieveOrganisationByIdSpy).toBeCalledWith(orgId);
      expect(retrieveFacilityByUuidSpy).toBeCalledWith(expectedFacilityUuid);
      expect(hospital).toEqual(expectedFacility);
      expect(organisation.name).toEqual(expectedOrganisationName);
      expect(error).toBeNull();
    });
  });
});
