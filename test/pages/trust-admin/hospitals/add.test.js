import { getServerSideProps } from "../../../../pages/trust-admin/hospitals/add";

describe("/trust-admin/hospitals/add", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  let res;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/login",
      });
    });
    it("returns an organisation and error prop", async () => {
      // Arrange
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const tokenProvider = {
        validate: jest.fn(() => ({ type: "trustAdmin", trustId: 1 })),
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const {
        props: { organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });
      // Assert
      expect(organisation.name).toEqual("Doggo Trust");
      expect(error).toBeNull();
    });
  });
});
