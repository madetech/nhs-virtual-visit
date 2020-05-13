import { getServerSideProps } from "../pages/admin";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../src/usecases/adminIsAuthenticated", () => () => (token) =>
  token && { admin: true, trustId: 1 }
);

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

    it("retrieves wards", async () => {
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: [
          {
            id: 1,
            name: "Defoe Ward",
            hospital_name: "Test Hospital",
            code: "test_code",
          },
          {
            id: 2,
            name: "Willem Ward",
            hospital_name: "Test Hospital 2",
            code: "test_code_2",
          },
        ],
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
      };

      await getServerSideProps({ req: authenticatedReq, res, container });

      expect(getRetrieveWardsSpy).toHaveBeenCalledWith(1);
    });
  });
});
