import { getServerSideProps } from "../../../../pages/wards/visits/[id]/edit-confirmation";

describe("wards/visits/[id]/edit-confirmation", () => {
  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      const anonymousReq = {
        headers: {
          cookie: "",
        },
      };

      const res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      };

      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });
  });
});
