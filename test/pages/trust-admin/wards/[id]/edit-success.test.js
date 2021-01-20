import { getServerSideProps } from "../../../../../pages/trust-admin/wards/[id]/edit-success";

describe("/trust-admin/wards/[id]/edit-success", () => {
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
  const retrieveWardByIdSpy = jest.fn().mockReturnValue({
    ward: {
      id: 1,
      name: "Defoe Ward",
      hospitalName: "Northwick Park Hospital",
    },
    error: null,
  });
  let res, container;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    container = {
      getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
      getRetrieveWardById: () => retrieveWardByIdSpy,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
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
    describe("with wardId parameter", () => {
      it("retrieves a ward by the wardId parameter", async () => {
        // Act
        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "ward ID",
          },
          container,
        });
        // Assert
        expect(retrieveWardByIdSpy).toHaveBeenCalledWith("ward ID", 1);
      });
      it("set a ward prop based on the retrieved ward", async () => {
        // Act
        const {
          props: { name, hospitalName, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "1",
          },
          container,
        });
        // Assert
        expect(name).toEqual("Defoe Ward");
        expect(hospitalName).toEqual("Northwick Park Hospital");
        expect(error).toBeNull();
      });
    });
  });
});
