import { getServerSideProps } from "../../pages/wards/book-a-visit-start";

describe("/wards/book-a-visit-start", () => {
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
