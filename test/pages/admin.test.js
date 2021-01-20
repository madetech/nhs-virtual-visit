import { getServerSideProps } from "../../pages/admin";

describe("admin", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };

  const organisations = [
    {
      id: 1,
      name: "Test Trust 1",
      adminCode: "test_code",
    },
    {
      id: 2,
      name: "Test Trust 2",
      adminCode: "test_code_2",
    },
  ];

  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "admin" })),
  };

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

    it("retrieves organisations", async () => {
      const getRetrieveActiveOrganisationsSpy = jest.fn(async () => ({
        organisations: organisations,
        error: null,
      }));
      const container = {
        getRetrieveActiveOrganisations: () => getRetrieveActiveOrganisationsSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(getRetrieveActiveOrganisationsSpy).toHaveBeenCalled();
      expect(props.organisations).toEqual(organisations);
      expect(props.error).toBeNull();
    });

    it("sets an error in props if organisations error", async () => {
      const getRetrieveActiveOrganisationsSpy = jest.fn(async () => ({
        organisations: null,
        error: "Error!",
      }));
      const container = {
        getRetrieveActiveOrganisations: () => getRetrieveActiveOrganisationsSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.error).toEqual("Error!");
    });
  });
});
