import { getServerSideProps } from "../../pages/performance";

describe("/performance", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };

  let res;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("Redirects to the login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/trust-admin/login",
      });
    });

    it("Provides the current visit totals as props", async () => {
      const wardVisitTotalSpy = jest.fn(() => ({ total: 30 }));
      const tokenProvider = {
        validate: jest.fn(() => ({ type: "trustAdmin" })),
      };
      const container = {
        getRetrieveWardVisitTotals: () => wardVisitTotalSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {},
        container,
      });

      expect(props).toEqual({ visitsScheduled: 30 });
    });
  });
});
