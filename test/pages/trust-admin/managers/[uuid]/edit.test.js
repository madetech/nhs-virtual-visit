import { getServerSideProps } from "pages/trust-admin/managers/[uuid]/edit";
import { TRUST_ADMIN } from "src/helpers/userTypes";

describe("trust-admin/managers/[uuid]/edit", () => {
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

  const trustId = 1;
  const tokenProvider = {
    validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId })),
  };

  const retrieveTrustByIdSuccessStub = jest.fn(async () => ({
    trust: { name: "Doggo Trust" },
    error: null,
  }));

  const expectedManager = {
    uuid: "1BBE43B3-4B2E-443E-8399-8299F22AB139",
    email: "nhs-manager1@nhs.co.uk",
    status: "active",
  };
  const retrieveManagerByUuidSuccessSpy = jest.fn(async () => ({
    manager: expectedManager,
    error: null,
  }));

  let res, container;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    container = {
      getRetrieveTrustById: () => retrieveTrustByIdSuccessStub,
      getRetrieveManagerByUuid: () => retrieveManagerByUuidSuccessSpy,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/trust-admin/login",
      });
    });

    it("retrieves manager by uuid", async () => {
      const uuid = "1BBE43B3-4B2E-443E-8399-8299F22AB139";
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: { uuid },
        container,
      });
      const actualManager = props.manager;
      expect(retrieveManagerByUuidSuccessSpy).toHaveBeenCalledWith(uuid);
      expect(actualManager.uuid).toEqual(expectedManager.uuid);
      expect(actualManager.email).toEqual(expectedManager.email);
      expect(actualManager.status).toEqual(expectedManager.status);
    });
  });
});
