import { getServerSideProps } from "../../pages/wards/[id]/schedule-confirmation";

describe("/wards/schedule-confirmation", () => {
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
