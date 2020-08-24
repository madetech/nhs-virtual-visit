import { getServerSideProps } from "../../../../pages/admin/trusts/[id]/add-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "admin" })),
};

describe("/admin/trusts/[id]/add-success", () => {
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
        Location: "/admin/login",
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
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "trust ID",
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
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
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
