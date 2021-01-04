<<<<<<< HEAD
<<<<<<< HEAD:test/pages/admin/add-a-trust.test.js
import { getServerSideProps } from "../../../pages/admin/add-a-trust";
=======
import { getServerSideProps } from "../../pages/admin/trusts/add-a-trust";
>>>>>>> test: retrieveOrganizationById.contractTest.js added:pageTests/admin/add-a-trust.test.js
=======
import { getServerSideProps } from "../../../pages/admin/trusts/add-a-trust";
>>>>>>> fix: fixing database seeding

describe("/trust-admin/add-a-trust", () => {
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
        Location: "/admin/login",
      });
    });
  });
});
