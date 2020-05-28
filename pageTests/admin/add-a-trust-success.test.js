import { getServerSideProps } from "../../pages/admin/add-a-trust-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "admin" })),
};

describe("/admin/add-a-trust-success", () => {
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
        Location: "/wards/login",
      });
    });

    describe("with trustId parameter", () => {
      it("retrieves a trust by the trustId parameter", async () => {
        const retrieveTrustByIdSpy = jest.fn().mockReturnValue({
          trust: {
            id: 1,
            name: "Northwick Park Trust",
          },
          error: null,
        });

        const container = {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
          getTokenProvider: () => tokenProvider,
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            trustId: "trust ID",
          },
          container,
        });

        expect(retrieveTrustByIdSpy).toHaveBeenCalledWith("trust ID");
      });

      it("set a trust prop based on the retrieved trust", async () => {
        const retrieveTrustByIdSpy = jest.fn().mockReturnValue({
          trust: {
            id: 1,
            name: "Northwick Park Trust",
          },
          error: null,
        });

        const container = {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
          getTokenProvider: () => tokenProvider,
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            trustId: "trust ID",
          },
          container,
        });

        expect(props.name).toEqual("Northwick Park Trust");
      });
    });
  });
});
