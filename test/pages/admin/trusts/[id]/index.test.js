import { getServerSideProps } from "../../../../../pages/admin/trusts/[id]";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "admin" })),
};

describe("/admin/admin/trusts/[id]", () => {
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

    it("retrieves a organisation by organisationId and sets the organisation prop", async () => {
      const retrieveOrganisationByIdSpy = jest.fn().mockReturnValue({
        organisation: {
          id: 1,
          name: "Northwick Park Trust",
        },
        error: null,
      });

      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveActiveManagersByOrgId: () => jest.fn().mockReturnValue({
          managers: ["nhs-manager@nhs.co.uk"],
          error: null,
        }),
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "1",
        },
        container,
      });

      expect(props.organisation).toEqual({
        id: 1, 
        name: "Northwick Park Trust"
      });
      expect(props.error).toBeNull();
      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith("1");
    });

    it("returns an error as a prop if there is an error with retrieving organisation", async () => {
      const container = {
        getRetrieveOrganisationById: () => jest.fn().mockReturnValue({
          organisation: null,
          error: "Organisation could not be found",
        }),
        getRetrieveActiveManagersByOrgId: () => jest.fn().mockReturnValue({
          managers: ["nhs-manager@nhs.co.uk"],
          error: null,
        }),
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "1",
        },
        container,
      });

      expect(props.organisation).toBeNull();
      expect(props.error).toEqual("Organisation could not be found");
    });

    it("retrieves the managers for an organisation and sets the managers prop", async () => {
      const retrieveActiveManagersByOrgIdSpy = jest.fn().mockReturnValue({
        managers: ["nhs-manager@nhs.co.uk", "nhs-manager2@nhs.co.uk"],
        error: null,
      });

      const container = {
        getRetrieveOrganisationById: () => jest.fn().mockReturnValue({
          organisation: {
            id: 1,
            name: "Northwick Park Trust",
          },
          error: null,
        }),
        getRetrieveActiveManagersByOrgId: () => retrieveActiveManagersByOrgIdSpy, 
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "1",
        },
        container,
      });

      expect(props.managers).toEqual(
        ["nhs-manager@nhs.co.uk", "nhs-manager2@nhs.co.uk"]
      );
      expect(props.error).toBeNull()
      expect(retrieveActiveManagersByOrgIdSpy).toHaveBeenCalledWith("1");
    });

    it("returns an error as a prop if there is an error with retrieving managers", async () => {
      const container = {
        getRetrieveOrganisationById: () => jest.fn().mockReturnValue({
          organisation: {
            id: 1,
            name: "Northwick Park Trust",
          },
          error: null,
        }),
        getRetrieveActiveManagersByOrgId: () => jest.fn().mockReturnValue({
          managers: null,
          error: "There was an error retrieving managers",
        }),
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "1",
        },
        container,
      });

      expect(props.managers).toBeNull();
      expect(props.error).toEqual("There was an error retrieving managers");
    });
  });
});