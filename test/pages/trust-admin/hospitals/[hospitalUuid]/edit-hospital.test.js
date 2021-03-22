import { getServerSideProps } from "../../../../../pages/trust-admin/hospitals/[hospitalUuid]/edit-hospital";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../../../src/helpers/userTypes";

describe("/trust-admin/hospitals/[hospitalUuid]/edit-hospital", () => {
  // Arrange
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
    it("retrieves the facility by id", async () => {
      // Arrange
      const orgId = 1;
      const facilityId = 2;
      const facilityUuid = "uuid";
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: "Doggo Trust" },
        error: null,
      }));
      const retrieveFacilityByUuidSpy = jest.fn().mockResolvedValue({
        facility: {
          id: facilityId,
          uuid: facilityUuid,
          name: "Northwick Park Hospital",
          status: "active",
        },
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
      // Act
      await getServerSideProps({
        req: authenticatedReq,
        res,
        params: { hospitalUuid: facilityUuid },
        container: { ...mockAppContainer },
      });
      // Assert
      expect(retrieveFacilityByUuidSpy).toHaveBeenCalledWith(facilityUuid);
    });
  });
});
