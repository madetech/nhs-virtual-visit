import { getServerSideProps } from "../../pages/wards/login";

describe("login", () => {
  describe("getServerSideProps", () => {
    const req = {
      headers: {
        cookie: "",
      },
    };

    let mockResponse;

    beforeEach(() => {
      mockResponse = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      };
    });

    it("does not redirect if not logged in", async () => {
      const container = {
        getUserIsAuthenticated: () => () => false,
        getTrustAdminIsAuthenticated: () => () => false,
      };

      await getServerSideProps({ req, res: mockResponse, container });

      expect(mockResponse.writeHead).not.toHaveBeenCalled();
    });

    it("redirects to the ward list page if user logged in", async () => {
      const container = {
        getUserIsAuthenticated: () => () => ({ ward: "my-test-ward" }),
        getTrustAdminIsAuthenticated: () => () => false,
      };

      await getServerSideProps({ req, res: mockResponse, container });

      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        307,
        expect.objectContaining({ Location: `/wards/visits` })
      );
    });

    it("redirects to the trust admin index page if trust admin logged in", async () => {
      const container = {
        getUserIsAuthenticated: () => () => false,
        getTrustAdminIsAuthenticated: () => () => ({ admin: true }),
      };

      await getServerSideProps({ req, res: mockResponse, container });

      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        307,
        expect.objectContaining({ Location: `/trust-admin` })
      );
    });
  });
});
