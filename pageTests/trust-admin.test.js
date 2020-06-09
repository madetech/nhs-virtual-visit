import { getServerSideProps } from "../pages/trust-admin";

describe("trust-admin", () => {
  let res;
  let trustId = 1;

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

  const hospitals = [
    { id: 1, name: "Hospital 1", totalVisits: 0 },
    { id: 2, name: "Hospital 2", totalVisits: 1 },
    { id: 3, name: "Hospital 3", totalVisits: 10 },
    { id: 4, name: "Hospital 4", totalVisits: 99 },
  ];

  const wards = [
    { id: 1, name: "Defoe Ward", hospital_id: 1, code: "test_code" },
    { id: 2, name: "Willem Ward", hospital_id: 1, code: "test_code_2" },
  ];

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: trustId })),
  };

  const getRetrieveWardsSpy = jest.fn(async () => ({
    wards: wards,
    error: null,
  }));

  const retrieveTrustByIdSpy = jest.fn(async () => ({
    trust: { name: "Doggo Trust" },
    error: null,
  }));

  const retrieveHospitalsByTrustId = jest.fn().mockReturnValue({
    hospitals: [
      { id: 1, name: "1" },
      { id: 2, name: "2" },
    ],
  });

  const retrieveWardVisitTotalsSpy = jest.fn().mockReturnValue({ total: 5 });

  const retrieveHospitalVisitTotals = jest.fn().mockReturnValue(hospitals);

  const container = {
    getRetrieveWards: () => getRetrieveWardsSpy,
    getRetrieveTrustById: () => retrieveTrustByIdSpy,
    getRetrieveHospitalsByTrustId: () => retrieveHospitalsByTrustId,
    getRetrieveWardVisitTotals: () => retrieveWardVisitTotalsSpy,
    getRetrieveHospitalVisitTotals: () => retrieveHospitalVisitTotals,
    getTokenProvider: () => tokenProvider,
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
        Location: "/wards/login",
      });
    });

    it("retrieves wards", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(getRetrieveWardsSpy).toHaveBeenCalledWith(1);
      expect(props.wards).toEqual(wards);
      expect(props.wardError).toBeNull();
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

    it("retrieves ward visit totals", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveWardVisitTotalsSpy).toHaveBeenCalledWith(trustId);
      expect(props.visitsScheduled).toEqual(5);
    });

    it("retrieves usage stats", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveHospitalVisitTotals).toHaveBeenCalledWith(trustId);
      expect(props.leastUsage.length).toBe(3);
      expect(props.mostUsage.length).toBe(3);
      expect(props.leastUsage).toEqual([
        { id: 1, name: "Hospital 1", totalVisits: 0 },
        { id: 2, name: "Hospital 2", totalVisits: 1 },
        { id: 3, name: "Hospital 3", totalVisits: 10 },
      ]);
      expect(props.mostUsage).toEqual([
        { id: 4, name: "Hospital 4", totalVisits: 99 },
        { id: 3, name: "Hospital 3", totalVisits: 10 },
        { id: 2, name: "Hospital 2", totalVisits: 1 },
      ]);
    });

    it("retrieves usage stats when fewer than 3 hospitals", async () => {
      const hospitals = [{ id: 1, name: "Hospital 1", totalVisits: 5 }];

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveHospitalVisitTotals: () =>
            jest.fn().mockReturnValue(hospitals),
        }),
      });

      expect(props.leastUsage.length).toBe(1);
      expect(props.mostUsage.length).toBe(1);
      expect(props.leastUsage).toEqual(hospitals);
      expect(props.mostUsage).toEqual(hospitals);
    });

    it("sets an error in props if ward error", async () => {
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: null,
        error: "Error!",
      }));

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveWards: () => getRetrieveWardsSpy,
        }),
      });

      expect(props.wardError).toEqual("Error!");
    });

    it("retrieves the trust of the trustAdmin", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveTrustByIdSpy).toHaveBeenCalledWith(trustId);
      expect(props.trust).toEqual({ name: "Doggo Trust" });
      expect(props.wardError).toBeNull();
    });

    it("sets an error in props if trust error", async () => {
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: null,
        error: "Error!",
      }));

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
        }),
      });

      expect(props.trustError).toEqual("Error!");
    });
  });
});
