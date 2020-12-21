import { getServerSideProps } from "../../../../../pages/admin/trusts/[id]/edit-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "admin" })),
};

describe("/admin/admin/trusts/[id]/edit-success", () => {
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

    it("retrieves a trust by the trustId parameter", async () => {
      const retrieveTrustByIdSpy = jest.fn().mockReturnValue({
        trust: {
          id: 1,
          name: "Northwick Park Trust",
          videoProvider: "whereby",
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
          id: "1",
        },
        container,
      });

      expect(retrieveTrustByIdSpy).toHaveBeenCalledWith("1");
    });

    it("set a trust prop based on the retrieved trust", async () => {
      const retrieveTrustByIdSpy = jest.fn().mockReturnValue({
        trust: {
          id: 1,
          name: "Northwick Park Trust",
          videoProvider: "whereby",
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

      expect(props.trust).toEqual({
        id: 1,
        name: "Northwick Park Trust",
        videoProvider: "whereby",
      });
    });
  });
});
