import { getServerSideProps } from "../../pages/wards/visit-start";

describe("visit-start", () => {
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
      const authenticationToken = {
        foo: true,
      };
      const tokenProvider = {
        validate: jest.fn(() => authenticationToken),
      };
      const container = {
        getTokenProvider: () => tokenProvider,
      };
      console.log(container);
      await getServerSideProps({ req: anonymousReq, res, container });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });
  });
});
