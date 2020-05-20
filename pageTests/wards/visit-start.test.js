import { getServerSideProps } from "../../pages/wards/visit-start";

describe("visit-start", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };
  let res;
  let authenticationToken;
  let tokenProvider;
  let container;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    authenticationToken = {
      foo: true,
    };
    tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };
    container = {
      getTokenProvider: () => tokenProvider,
      getRetrieveWardById: () => jest.fn().mockReturnValue({ error: null }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res, container });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });
  });
});
