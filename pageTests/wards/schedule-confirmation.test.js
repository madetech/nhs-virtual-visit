import { getServerSideProps } from "../../pages/wards/schedule-confirmation";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123" }
);

describe("/wards/schedule-confirmation", () => {
  describe("getServerSideProps", () => {
    const anonymousReq = {
      headers: {
        cookie: "",
      },
      query: {},
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
        end: jest.fn(),
      };
    });

    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });

    it("retrieves the ward id from the authentication token", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {},
      });

      expect(props.id).toEqual("123");
    });
  });
});
