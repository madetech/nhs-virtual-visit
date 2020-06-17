import { getServerSideProps } from "../pages/admin";

describe("admin", () => {
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

  const trusts = [
    {
      id: 1,
      name: "Test Trust 1",
      adminCode: "test_code",
    },
    {
      id: 2,
      name: "Test Trust 2",
      adminCode: "test_code_2",
    },
  ];

  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "admin" })),
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
        Location: "/admin/login",
      });
    });

    it("retrieves trusts", async () => {
      const getRetrieveTrustsSpy = jest.fn(async () => ({
        trusts: trusts,
        error: null,
      }));
      const container = {
        getRetrieveTrusts: () => getRetrieveTrustsSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(getRetrieveTrustsSpy).toHaveBeenCalled();
      expect(props.trusts).toEqual(trusts);
      expect(props.error).toBeNull();
    });

    it("sets an error in props if trusts error", async () => {
      const getRetrieveTrustsSpy = jest.fn(async () => ({
        trusts: null,
        error: "Error!",
      }));
      const container = {
        getRetrieveTrusts: () => getRetrieveTrustsSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.error).toEqual("Error!");
    });
  });
});
