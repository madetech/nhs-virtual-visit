import { getServerSideProps } from "../../../../../pages/trust-admin/wards/[id]/archive-confirmation";

describe("/trust-admin/wards/[id]/archive-confirmation", () => {
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
        Location: "/trust-admin/login",
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
      const expectedWard = {
        id: 1,
        name: "Defoe Ward",
        hospitalId: 2,
        hospitalName: "Northwick Park Hospital",
      };
      const tokenProvider = {
        validate: jest.fn(() => ({
          type: "trustAdmin",
          trustId: expectedOrgId,
        })),
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: expectedOrganisationName },
        error: null,
      }));

      const retrieveWardByIdSpy = jest.fn().mockReturnValue({
        ward: expectedWard,
        error: null,
      });
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveWardById: () => retrieveWardByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const {
        props: { ward, organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: expectedWard.id,
        },
        container,
      });
      // Assert
      expect(retrieveWardByIdSpy).toHaveBeenCalledWith(
        expectedOrgId,
        expectedWard.id
      );
      expect(organisation.name).toEqual(expectedOrganisationName);
      expect(ward).toEqual(expectedWard);
      expect(error).toBeNull();
    });
  });
});
