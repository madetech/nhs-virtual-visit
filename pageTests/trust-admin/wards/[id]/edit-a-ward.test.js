import { getServerSideProps } from "../../../../pages/trust-admin/wards/[id]/edit";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

describe("/trust-admin/wards/[id]/edit", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: 10 })),
  };

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/trust-admin/login",
      });
    });

    describe("with wardId parameter", () => {
      it("retrieves a ward by the wardId parameter", async () => {
        const retrieveWardByIdSpy = jest.fn().mockReturnValue({
          ward: {
            id: 1,
            name: "Defoe Ward",
            hospitalName: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveWardById: () => retrieveWardByIdSpy,
          getRetrieveHospitalsByTrustId: () =>
            jest.fn().mockReturnValue({
              hospitals: [],
              error: null,
            }),
          getTokenProvider: () => tokenProvider,
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "ward ID",
          },
          container,
        });

        expect(retrieveWardByIdSpy).toHaveBeenCalledWith("ward ID", 10);
      });

      it("set a ward prop based on the retrieved ward", async () => {
        const retrieveWardByIdSpy = jest.fn().mockReturnValue({
          ward: {
            id: 1,
            name: "Defoe Ward",
            hospitalId: "1",
          },
          error: null,
        });

        const container = {
          getRetrieveWardById: () => retrieveWardByIdSpy,
          getRetrieveHospitalsByTrustId: () =>
            jest.fn().mockReturnValue({
              hospitals: [],
              error: null,
            }),
          getTokenProvider: () => tokenProvider,
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "1",
          },
          container,
        });

        expect(props.id).toEqual(1);
        expect(props.name).toEqual("Defoe Ward");
        expect(props.hospitalId).toEqual("1");
      });
    });
  });
});
