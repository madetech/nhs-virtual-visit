import { getServerSideProps } from "../../../pages/trust-admin/hospitals/index";

describe("trust-admin/hospitals", () => {
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

  let retrieveTrustByIdSpy = jest.fn(async () => ({
    trust: { name: "Doggo Trust" },
    error: null,
  }));

  let getRetrieveHospitalsByTrustIdSpy = jest.fn(async () => ({
    hospitals: [
      { id: 1, name: "1" },
      { id: 2, name: "2" },
    ],
    error: null,
  }));

  let res, container;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    container = {
      getRetrieveTrustById: () => retrieveTrustByIdSpy,
      getRetrieveHospitalsByTrustId: () => getRetrieveHospitalsByTrustIdSpy,
      getTokenProvider: () => tokenProvider,
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });

    it("retrieves hospitals", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.hospitals.length).toEqual(2);
      expect(props.hospitals[0].id).toEqual(1);
      expect(props.hospitals[1].name).toEqual("2");
    });

    it("sets an error in props if hospital error", async () => {
      getRetrieveHospitalsByTrustIdSpy = jest.fn(async () => ({
        hospitals: null,
        error: "Error!",
      }));
      container = {
        ...container,
        getRetrieveHospitalsByTrustId: () => getRetrieveHospitalsByTrustIdSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.hospitalError).toEqual("Error!");
    });

    it("retrieves the trust of the trustAdmin", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveTrustByIdSpy).toHaveBeenCalledWith(trustId);
      expect(props.trust).toEqual({ name: "Doggo Trust" });
    });

    it("sets an error in props if trust error", async () => {
      retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: null,
        error: "Error!",
      }));
      container = {
        ...container,
        getRetrieveHospitalsByTrustId: () => getRetrieveHospitalsByTrustIdSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.trustError).toEqual("Error!");
    });
  });
});
