import { getServerSideProps } from "../../pages/trust-admin";

describe("trust-admin", () => {
  let res;
  let trustId = 1;
  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };

  const hospitals = {
    hospitals: [
      { id: 1, name: "Hospital 1", totalVisits: 0 },
      { id: 2, name: "Hospital 2", totalVisits: 1 },
      { id: 3, name: "Hospital 3", totalVisits: 10 },
      { id: 4, name: "Hospital 4", totalVisits: 99 },
    ],
    mostVisited: [
      { id: 4, name: "Hospital 4", totalVisits: 99 },
      { id: 3, name: "Hospital 3", totalVisits: 10 },
      { id: 2, name: "Hospital 2", totalVisits: 1 },
    ],
    leastVisited: [
      { id: 1, name: "Hospital 1", totalVisits: 0 },
      { id: 2, name: "Hospital 2", totalVisits: 1 },
      { id: 3, name: "Hospital 3", totalVisits: 10 },
    ],
  };

  const wards = [
    { id: 1, name: "Defoe Ward", hospital_id: 1, code: "test_code" },
    { id: 2, name: "Willem Ward", hospital_id: 1, code: "test_code_2" },
  ];
  const expectedFacilities = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
  ];

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: trustId })),
  };

  const getRetrieveWardsSpy = jest.fn(async () => ({
    wards: wards,
    error: null,
  }));

  const retrieveOrganisationByIdSpy = jest.fn(async () => ({
    organisation: { name: "Doggo Trust" },
    error: null,
  }));

  const retrieveFacilitiesByOrgId = jest.fn().mockReturnValue({
    facilities: expectedFacilities,
    error: null,
  });

  const retrieveWardVisitTotalsSpy = jest.fn().mockReturnValue({ total: 1234 });

  const retrieveHospitalVisitTotals = jest.fn().mockReturnValue(hospitals);

  const retrieveAverageParticipantsInVisit = jest
    .fn()
    .mockReturnValue({ averageParticipantsInVisit: 3, error: null });

  const retrieveAverageVisitTimeByTrustId = jest
    .fn()
    .mockReturnValue({ averageVisitTime: "1hr, 10mins", error: null });

  const retrieveWardVisitTotalsStartDateByTrustId = jest
    .fn()
    .mockReturnValue({ startDate: "1 April 2020", error: null });

  const retrieveReportingStartDateByTrustId = jest
    .fn()
    .mockReturnValue({ startDate: "1 May 2020", error: null });

  const retrieveAverageVisitsPerDayByTrustId = jest.fn().mockReturnValue({
    averageVisitsPerDay: 1,
    error: null,
  });

  const container = {
    getRetrieveWards: () => getRetrieveWardsSpy,
    getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
    getRetrieveFacilitiesByOrgId: () => retrieveFacilitiesByOrgId,
    getRetrieveWardVisitTotals: () => retrieveWardVisitTotalsSpy,
    getRetrieveHospitalVisitTotals: () => retrieveHospitalVisitTotals,
    getRetrieveAverageParticipantsInVisit: () =>
      retrieveAverageParticipantsInVisit,
    getRetrieveAverageVisitTimeByTrustId: () =>
      retrieveAverageVisitTimeByTrustId,
    getRetrieveWardVisitTotalsStartDateByTrustId: () =>
      retrieveWardVisitTotalsStartDateByTrustId,
    getRetrieveReportingStartDateByTrustId: () =>
      retrieveReportingStartDateByTrustId,
    getRetrieveAverageVisitsPerDayByTrustId: () =>
      retrieveAverageVisitsPerDayByTrustId,
    getTokenProvider: () => tokenProvider,
    getRegenerateToken: () => jest.fn().mockReturnValue({}),
  };

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      // Arrange
      const anonymousReq = {
        headers: {
          cookie: "",
        },
      };
      // Act
      await getServerSideProps({ req: anonymousReq, res });
      // Assert
      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/login",
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
      expect(props.error).toBeNull();
    });

    it("retrieves hospitals", async () => {
      const {
        props: { hospitals, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(hospitals.length).toEqual(2);
      expect(hospitals).toEqual(expectedFacilities);
      expect(error).toBeNull();
    });

    it("retrieves ward visit totals", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveWardVisitTotalsSpy).toHaveBeenCalledWith(trustId);
      expect(props.visitsScheduled).toEqual("1,234");
    });

    it("retrieves usage stats", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveHospitalVisitTotals).toHaveBeenCalledWith(trustId);
      expect(props.leastVisited.length).toBe(3);
      expect(props.mostVisited.length).toBe(3);
      expect(props.leastVisited).toEqual([
        { id: 1, name: "Hospital 1", totalVisits: 0 },
        { id: 2, name: "Hospital 2", totalVisits: 1 },
        { id: 3, name: "Hospital 3", totalVisits: 10 },
      ]);
      expect(props.mostVisited).toEqual([
        { id: 4, name: "Hospital 4", totalVisits: 99 },
        { id: 3, name: "Hospital 3", totalVisits: 10 },
        { id: 2, name: "Hospital 2", totalVisits: 1 },
      ]);
    });

    it("retrieves usage stats when fewer than 3 hospitals", async () => {
      const threeHospitals = {
        hospitals: [{ id: 1, name: "Hospital 1", totalVisits: 5 }],
        leastVisited: [{ id: 1, name: "Hospital 1", totalVisits: 5 }],
        mostVisited: [{ id: 1, name: "Hospital 1", totalVisits: 5 }],
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveHospitalVisitTotals: () =>
            jest.fn().mockReturnValue(threeHospitals),
        }),
      });

      expect(props.leastVisited.length).toBe(1);
      expect(props.mostVisited.length).toBe(1);
      expect(props.leastVisited).toEqual(threeHospitals.leastVisited);
      expect(props.mostVisited).toEqual(threeHospitals.mostVisited);
    });

    it("sets an error in props if ward error", async () => {
      const getRetrieveWardsSpyError = jest.fn(async () => ({
        wards: null,
        error: "Error!",
      }));

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveWards: () => getRetrieveWardsSpyError,
        }),
      });

      expect(props.error).toEqual("Error!");
    });

    it("retrieves the trust of the trustAdmin", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(trustId);
      expect(props.organisation).toEqual({ name: "Doggo Trust" });
      expect(props.error).toBeNull();
    });

    it("sets an error in props if trust error", async () => {
      const retrieveOrgByIdSpyError = jest.fn(async () => ({
        trust: null,
        error: "Error!",
      }));

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveOrganisationById: () => retrieveOrgByIdSpyError,
        }),
      });

      expect(props.error).toEqual("Error!");
    });

    it("retrieves the average number of participants in a visit", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveAverageParticipantsInVisit).toHaveBeenCalledWith(trustId);
      expect(props.averageParticipantsInVisit).toEqual(3);
      expect(props.error).toBeNull();
    });

    it("sets an error in props if average participants in visit error", async () => {
      const retrieveAverageParticipantsInVisitError = jest.fn(async () => ({
        error: "Error!",
      }));

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: Object.assign({}, container, {
          getRetrieveAverageParticipantsInVisit: () =>
            retrieveAverageParticipantsInVisitError,
        }),
      });

      expect(props.error).toEqual("Error!");
    });

    it("retrieves the average visit duration", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveAverageVisitTimeByTrustId).toHaveBeenCalledWith(trustId);
      expect(props.averageVisitTime).toEqual("1hr, 10mins");
      expect(props.error).toBeNull();
    });

    it("retrieves the average visits per day", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveAverageVisitsPerDayByTrustId).toHaveBeenCalledWith(
        trustId
      );
      expect(props.averageVisitsPerDay).toEqual("1.0");
      expect(props.error).toBeNull();
    });

    it("retrieves the starting date for booked visits reporting", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveWardVisitTotalsStartDateByTrustId).toHaveBeenCalledWith(
        trustId
      );
      expect(props.wardVisitTotalsStartDate).toEqual("1 April 2020");
      expect(props.error).toBeNull();
    });

    it("sets an error in props if starting date for booked visits reporting error", async () => {
      const retrieveWardVisitTotalsStartDateByTrustIdError = jest.fn(
        async () => ({
          startDate: null,
          error: "Error!",
        })
      );

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: {
          ...container,
          getRetrieveWardVisitTotalsStartDateByTrustId: () =>
            retrieveWardVisitTotalsStartDateByTrustIdError,
        },
      });

      expect(props.error).toEqual("Error!");
    });

    it("retrieves the starting date for events reporting", async () => {
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveReportingStartDateByTrustId).toHaveBeenCalledWith(trustId);
      expect(props.reportingStartDate).toEqual("1 May 2020");
      expect(props.error).toBeNull();
    });

    it("sets an error in props if starting date for events reporting error", async () => {
      const retrieveReportingStartDateByTrustIdError = jest.fn(async () => ({
        startDate: null,
        error: "Error!",
      }));

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container: {
          ...container,
          getRetrieveReportingStartDateByTrustId: () =>
            retrieveReportingStartDateByTrustIdError,
        },
      });

      expect(props.error).toEqual("Error!");
    });
  });
});
