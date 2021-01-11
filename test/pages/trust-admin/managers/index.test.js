import { getServerSideProps } from "../../../../pages/trust-admin/managers/index";

describe("trust-admin/managers", () => {
  const trustId = 1;

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

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: trustId })),
  };

  const retrieveTrustByIdSuccessStub = jest.fn(async () => ({
    trust: { name: "Doggo Trust" },
    error: null,
  }));

  const managersArray = [
    {
      uuid: "1BBE43B3-4B2E-443E-8399-8299F22AB139",
      email: "nhs-manager1@nhs.co.uk",
      status: "active",
    },
    {
      uuid: "F8F800FE-7A7E-4419-BA6F-7EFDD7871331",
      email: "nhs-manager2@nhs.co.uk",
      status: "disabled",
    },
  ];
  const retrieveManagersByOrgIdSuccessSpy = jest.fn(async () => ({
    managers: managersArray,
    error: null,
  }));

  let res, container;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    container = {
      getRetrieveTrustById: () => retrieveTrustByIdSuccessStub,
      getRetrieveManagersByOrgId: () => retrieveManagersByOrgIdSuccessSpy,
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

    it("retrieves managers", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveManagersByOrgIdSuccessSpy).toHaveBeenCalledWith(trustId);
      expect(props.managers.length).toEqual(2);
      props.managers.forEach((manager, idx) => {
        expect(manager.uuid).toEqual(managersArray[idx].uuid);
        expect(manager.email).toEqual(managersArray[idx].email);
        expect(manager.status).toEqual(managersArray[idx].status);
      });
    });
  });
});
