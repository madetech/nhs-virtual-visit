import { getServerSideProps } from "../../../../../pages/admin/trusts/[id]/edit";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "admin" })),
};

describe("/admin/admin/trusts/[id]/edit", () => {
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
    it("redirects to root page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/",
      });
    });

    it("retrieves a trust by the trustId parameter", async () => {
      const retrieveOrganisationByIdSpy = jest.fn().mockReturnValue({
        trust: {
          id: 1,
          name: "Northwick Park Trust",
          videoProvider: "whereby",
        },
        error: null,
      });

      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "1",
        },
        container,
      });

      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith("1");
    });

    it("set a trust prop based on the retrieved trust", async () => {
      const retrieveOrganisationByIdSpy = jest.fn().mockReturnValue({
        trust: {
          id: 1,
          name: "Northwick Park Trust",
          videoProvider: "whereby",
        },
        error: null,
      });

      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          trustId: "trust ID",
        },
        container,
      });

      expect(props.trust).toEqual({
        id: 1,
        name: "Northwick Park Trust",
        videoProvider: "whereby",
      });
    });
  });
});
