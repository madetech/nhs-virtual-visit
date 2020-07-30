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

  const retrieveTrustByIdSuccessStub = jest.fn(async () => ({
    trust: { name: "Doggo Trust" },
    error: null,
  }));

  const retrieveHospitalsByTrustIdSuccessSpy = jest.fn(async () => ({
    hospitals: [
      { id: 1, name: "1", wards: [{ id: 1, name: "Ward 1" }] },
      { id: 2, name: "2", wards: [{ id: 2, name: "Ward 2" }] },
    ],
    error: null,
  }));

  const retrieveHospitalVisitTotalsStub = jest.fn(async () => ({
    hospitals: [
      { id: 1, name: "Test Hospital", totalVisits: 5 },
      { id: 2, name: "Test Hospital", totalVisits: 10 },
    ],
    leastVisited: [{ id: 1, name: "Test Hospital", totalVisits: 5 }],
    mostVisited: [{ id: 2, name: "Test Hospital", totalVisits: 10 }],
  }));

  let res, container;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    container = {
      getRetrieveTrustById: () => retrieveTrustByIdSuccessStub,
      getRetrieveHospitalsByTrustId: () => retrieveHospitalsByTrustIdSuccessSpy,
      getRetrieveHospitalVisitTotals: () => retrieveHospitalVisitTotalsStub,
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

    it("retrieves hospitals", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveHospitalsByTrustIdSuccessSpy).toHaveBeenCalledWith(
        trustId,
        { withWards: true }
      );
      expect(props.hospitals.length).toEqual(2);
      expect(props.hospitals[0].id).toEqual(1);
      expect(props.hospitals[1].name).toEqual("2");
    });

    it("sets an error in props if hospital error", async () => {
      const retrieveHospitalsByTrustIdErrorStub = jest.fn(async () => ({
        hospitals: null,
        error: "Error!",
      }));
      container = {
        ...container,
        getRetrieveHospitalsByTrustId: () =>
          retrieveHospitalsByTrustIdErrorStub,
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

      expect(retrieveTrustByIdSuccessStub).toHaveBeenCalledWith(trustId);
      expect(props.trust).toEqual({ name: "Doggo Trust" });
    });

    it("sets an error in props if trust error", async () => {
      const retrieveTrustByIdErrorStub = jest.fn(async () => ({
        trust: null,
        error: "Error!",
      }));
      container = {
        ...container,
        getRetrieveTrustById: () => retrieveTrustByIdErrorStub,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.trustError).toEqual("Error!");
    });

    it("retrieves the number of booked visits for the trust's hospitals", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveHospitalVisitTotalsStub).toHaveBeenCalledWith(trustId);
      expect(props.hospitals).toEqual([
        {
          id: 1,
          name: "1",
          bookedVisits: 5,
          wards: [{ id: 1, name: "Ward 1" }],
        },
        {
          id: 2,
          name: "2",
          bookedVisits: 10,
          wards: [{ id: 2, name: "Ward 2" }],
        },
      ]);
    });
  });
});
