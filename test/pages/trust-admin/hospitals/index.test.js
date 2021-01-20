import { getServerSideProps } from "../../../../pages/trust-admin/hospitals/index";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
describe("trust-admin/hospitals", () => {
  const orgId = 1;
  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };
  const tokenProvider = {
    validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
  };
  const expectedHospitals = [
    { id: 1, name: "1", wards: [{ id: 1, name: "Ward 1" }] },
    { id: 2, name: "2", wards: [{ id: 2, name: "Ward 2" }] },
  ];
  const expectedHospitalVisitObj = {
    hospitals: [
      { id: 1, name: "Test Hospital", totalVisits: 5 },
      { id: 2, name: "Test Hospital", totalVisits: 10 },
    ],
    leastVisited: [{ id: 1, name: "Test Hospital", totalVisits: 5 }],
    mostVisited: [{ id: 2, name: "Test Hospital", totalVisits: 10 }],
    error: null,
  };
  const retrieveOrganisationByIdSpy = jest.fn(async () => ({
    organisation: { name: "Doggo Trust" },
    error: null,
  }));
  const retrieveHospitalsByTrustIdSuccessSpy = jest.fn(async () => ({
    hospitals: expectedHospitals,
    error: null,
  }));
  const retrieveHospitalVisitTotalsStub = jest.fn(
    async () => expectedHospitalVisitObj
  );
  let res, container;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
    container = {
      getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
      getRetrieveHospitalsByTrustId: () => retrieveHospitalsByTrustIdSuccessSpy,
      getRetrieveHospitalVisitTotals: () => retrieveHospitalVisitTotalsStub,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
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
        Location: "/trust-admin/login",
      });
    });

    it("retrieves hospitals", async () => {
      // Act
      const {
        props: { hospitals },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });
      // Assert
      expect(retrieveHospitalsByTrustIdSuccessSpy).toHaveBeenCalledWith(orgId, {
        withWards: true,
      });
      expect(hospitals.length).toEqual(2);
      expect(hospitals).toEqual(expectedHospitals);
    });

    it("sets an error in props if hospital error", async () => {
      // Arrange
      const retrieveHospitalsByTrustIdErrorStub = jest.fn(async () => ({
        hospitals: null,
        error: "Error!",
      }));
      container = {
        ...container,
        getRetrieveHospitalsByTrustId: () =>
          retrieveHospitalsByTrustIdErrorStub,
      };
      // Act
      const {
        props: { error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });
      // Assert
      expect(error).toEqual("Error!");
    });

    it("retrieves the trust of the trustAdmin", async () => {
      // Act
      const {
        props: { organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });
      // Assert
      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
      expect(organisation.name).toEqual("Doggo Trust");
      expect(error).toBeNull();
    });

    it("sets an error in props if trust error", async () => {
      // Arrange
      const retrieveOrganisationByIdErrorStub = jest.fn(async () => ({
        organisation: null,
        error: "Error!",
      }));
      container = {
        ...container,
        getRetrieveOrganisationById: () => retrieveOrganisationByIdErrorStub,
      };
      // Act
      const {
        props: { organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });
      // Assert
      expect(error).toEqual("Error!");
      expect(organisation).toBeNull();
    });

    it("retrieves the number of booked visits for the trust's hospitals", async () => {
      // Arrange
      // Act
      const {
        props: { hospitals },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });
      // Assert
      expect(retrieveHospitalVisitTotalsStub).toHaveBeenCalledWith(orgId);
      expect(hospitals).toEqual([
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
