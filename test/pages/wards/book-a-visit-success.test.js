import { getServerSideProps } from "../../../pages/wards/book-a-visit-success";

describe("wards/book-a-visit-success", () => {
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

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "wardStaff", wardId: 123, trustId: 10 })),
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
        Location: "/wards/login",
      });
    });

    it("retrieves the ward id from the authentication token", async () => {
      const getRetrieveWardByIdSpy = jest.fn().mockReturnValue({});

      const container = {
        getRetrieveWardById: () => getRetrieveWardByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {},
        container: container,
      });

      expect(props).toBeDefined();
      expect(getRetrieveWardByIdSpy).toBeCalledWith(123, 10);
    });
  });
});
