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

    it("does not redirects not logged in", async () => {
      const container = {
        getUserIsAuthenticated: () => () => false,
      };

      await getServerSideProps({ req, res: mockResponse, container });

      expect(mockResponse.writeHead).not.toHaveBeenCalled();
    });

    it("redirects to the ward list page if logged in", async () => {
      const container = {
        getUserIsAuthenticated: () => () => ({ ward: "my-test-ward" }),
      };

      await getServerSideProps({ req, res: mockResponse, container });

      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        302,
        expect.objectContaining({ Location: `/wards/my-test-ward/visits` })
      );
    });
  });
});
