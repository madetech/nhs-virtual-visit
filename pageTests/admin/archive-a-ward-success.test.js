import { getServerSideProps } from "../../pages/admin/archive-a-ward-success";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/adminIsAuthenticated", () => () => (token) =>
  token && { admin: true }
);

describe("/admin/archive-a-ward-success", () => {
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
        Location: "/wards/login",
      });
    });
  });
});
