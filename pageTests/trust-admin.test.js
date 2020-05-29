import { getServerSideProps } from "../pages/trust-admin";

describe("trust-admin", () => {
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

  const wards = [
    {
      id: 1,
      name: "Defoe Ward",
      hosptial_id: 1,
      code: "test_code",
    },
    {
      id: 2,
      name: "Willem Ward",
      hosptial_id: 1,
      code: "test_code_2",
    },
  ];

  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: 1 })),
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
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: wards,
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
        getRetrieveHospitalsByTrustId: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getRetrieveWardVisitTotals: () =>
          jest.fn().mockReturnValue({ total: 0 }),
        getTokenProvider: () => tokenProvider,
      };

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
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: wards,
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
        getRetrieveHospitalsByTrustId: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getRetrieveWardVisitTotals: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getTokenProvider: () => tokenProvider,
      };

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
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: wards,
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
        getRetrieveHospitalsByTrustId: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getRetrieveWardVisitTotals: () =>
          jest.fn().mockReturnValue({ total: 5 }),
        getTokenProvider: () => tokenProvider,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.visitsScheduled).toEqual(5);
    });

    it("sets an error in props if ward error", async () => {
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: null,
        error: "Error!",
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
        getRetrieveHospitalsByTrustId: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getRetrieveWardVisitTotals: () =>
          jest.fn().mockReturnValue({ total: 0 }),
        getTokenProvider: () => tokenProvider,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.wardError).toEqual("Error!");
    });

    it("retrieves the trust of the trustAdmin", async () => {
      const trustId = 1;
      const getRetrieveWardsSpy = jest.fn(async () => ({
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: {
          id: trustId,
          name: "Doggo Trust",
        },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
        getRetrieveHospitalsByTrustId: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getRetrieveWardVisitTotals: () =>
          jest.fn().mockReturnValue({ total: 0 }),
        getTokenProvider: () => tokenProvider,
      };

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
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: wards,
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: null,
        error: "Error!",
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
        getRetrieveHospitalsByTrustId: () =>
          jest.fn().mockReturnValue({
            hospitals: [
              { id: 1, name: "1" },
              { id: 2, name: "2" },
            ],
          }),
        getRetrieveWardVisitTotals: () =>
          jest.fn().mockReturnValue({ total: 0 }),
        getTokenProvider: () => tokenProvider,
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
