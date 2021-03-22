import { getServerSideProps } from "../../../../../pages/trust-admin/hospitals/[hospitalUuid]/add-hospital-success";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../../../src/helpers/userTypes";

describe("/hospitals/[hospitalUuid]/add-hospital-success", () => {
  // Arrange
  const orgId = 1;
  const expectedFacilityUuid = "uuid";
  const expectedFacility = {
    uuid: expectedFacilityUuid,
    name: "Hospital1",
  };
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
    facility: expectedFacility,
    error: null,
  });

  let res;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    mockAppContainer
      .getTokenProvider()
      .validate.mockImplementationOnce(() => ({
        type: TRUST_ADMIN,
        trustId: orgId,
      }));
    mockAppContainer.getRetrieveOrganisationById.mockImplementationOnce(
      () => retrieveOrganisationByIdSpy
    );
    mockAppContainer.getRetrieveFacilityByUuid.mockImplementation(
      () => retrieveFacilityByUuidSpy
    );
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

    describe("with hospitalUuid parameter", () => {
      it("retrieves a hospital by the hospitalUuid parameter", async () => {
        // Act
        await getServerSideProps({
          req: authenticatedReq,
          res,
          params: {
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(retrieveFacilityByUuidSpy).toHaveBeenCalledWith(
          expectedFacilityUuid
        );
      });

      it("set a hospital prop based on the retrieved hospital", async () => {
        // Act
        const {
          props: { hospital, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          params: {
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(hospital).toEqual(expectedFacility);
        expect(error).toBeNull();
      });
    });
  });
});
