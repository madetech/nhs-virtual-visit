import { getServerSideProps } from "../../../../pages/trust-admin/wards/[id]/archive-confirmation";

describe("/trust-admin/wards/[id]/archive-confirmation", () => {
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
        Location: "/trust-admin/login",
      });
    });
  });
});
