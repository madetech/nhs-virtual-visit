import { getServerSideProps } from "../../../../../pages/trust-admin/wards/[id]/add-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

describe("/trust-admin/wards/[id]/add-success", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: 1 })),
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
        const retrieveTrustByIdSpy = jest.fn(async () => ({
          trust: { name: "Doggo Trust" },
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

        const container = {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
          getRetrieveWardById: () => retrieveWardByIdSpy,
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

        expect(retrieveWardByIdSpy).toHaveBeenCalledWith("ward ID", 1);
      });

      it("set a ward prop based on the retrieved ward", async () => {
        const retrieveTrustByIdSpy = jest.fn(async () => ({
          trust: { name: "Doggo Trust" },
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

        const container = {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
          getRetrieveWardById: () => retrieveWardByIdSpy,
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

        expect(props.name).toEqual("Defoe Ward");
        expect(props.hospitalName).toEqual("Northwick Park Hospital");
      });
    });
  });
});
