import { getServerSideProps } from "../../../../../pages/trust-admin/hospitals/[id]/add-success";

describe("/trust-admin/hospitals/[id]/add-success", () => {
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
  const retrieveHospitalByIdSpy = jest.fn().mockReturnValue({
    hospital: {
      id: 1,
      name: "Northwick Park Hospital",
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
      getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
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

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/trust-admin/login",
      });
    });
    // Assert
    describe("with hospitalId parameter", () => {
      it("retrieves a hospital by the hospitalId parameter", async () => {
        // Act
        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "hospital ID",
          },
          container,
        });
        // Assert
        expect(retrieveHospitalByIdSpy).toHaveBeenCalledWith("hospital ID", 1);
      });

      it("set a hospital prop based on the retrieved hospital", async () => {
        // Act
        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            hospitalId: "hospital ID",
          },
          container,
        });
        // Assert
        expect(props.name).toEqual("Northwick Park Hospital");
      });
    });
  });
});
