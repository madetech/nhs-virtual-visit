import { getServerSideProps } from "../../pages/wards/login";
import TokenProvider from "../../src/providers/TokenProvider";

describe("login", () => {
  describe("prop provider", () => {
    let mockResponse;
    beforeEach(() => {
      mockResponse = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      };
    });

    it("does not redirects not logged in", () => {
      const req = {
        headers: {
          cookie: "",
        },
      };

      getServerSideProps({ req, res: mockResponse });

      expect(mockResponse.writeHead).not.toHaveBeenCalled();
    });

    it("redirects to the ward list page if logged in", () => {
      process.env.JWT_SIGNING_KEY = "test-key";
      const tokenProvider = new TokenProvider(process.env.JWT_SIGNING_KEY);
      const token = tokenProvider.generate("my-test-ward");
      const req = {
        headers: {
          cookie: `token=${token}`,
        },
      };

      getServerSideProps({ req, res: mockResponse });

      expect(mockResponse.writeHead).toHaveBeenCalledWith(
        302,
        expect.objectContaining({ Location: `/wards/my-test-ward/visits` })
      );
    });
  });
});
