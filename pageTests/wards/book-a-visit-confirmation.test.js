import { getServerSideProps } from "../../pages/wards/book-a-visit-confirmation";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123" }
);

describe("/wards/book-a-visit-confirmation", () => {
  describe("getServerSideProps", () => {
    const anonymousReq = {
      headers: {
        cookie: "",
      },
      query: {},
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
  });
});
