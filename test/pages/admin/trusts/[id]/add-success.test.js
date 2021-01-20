import { getServerSideProps } from "../../../../../pages/admin/trusts/[id]/add-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "admin" })),
};

describe("/admin/trusts/[id]/add-success", () => {
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

    describe("with organisationId parameter", () => {
      it("retrieves an organisation by the organisationId parameter", async () => {
        const retrieveOrganisationByIdSpy = jest.fn().mockReturnValue({
          organisation: {
            id: 1,
            name: "Northwick Park Trust",
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
            id: "trust ID",
          },
          container,
        });

        expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith("trust ID");
      });

      xit("set a organisation prop based on the retrieved organization", async () => {
        const retrieveOrganisationByIdSpy = jest.fn().mockReturnValue({
          organization: {
            id: 1,
            name: "Northwick Park Trust",
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
            id: "trust ID",
          },
          container,
        });

        expect(props.name).toEqual("Northwick Park Trust");
      });
    });
  });
});
