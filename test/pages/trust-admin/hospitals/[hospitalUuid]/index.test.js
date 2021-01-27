import { getServerSideProps } from "../../../../../pages/trust-admin/hospitals/[hospitalUuid]";
import { TRUST_ADMIN } from "../../../../../src/helpers/userTypes";
describe("/trust-admin/hospitals/[hospitalUuid]rust-admin/hospitals/[id]", () => {
  let res;
  const orgId = 1;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
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

    it("provides the organisation, facility and departments as props", async () => {
      // Arrange
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedFacilityUuid = "facility-uuid";
      const expectedFacilityId = 1;
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: "Doggo Trust" },
        error: null,
      }));
      const departmentsSpy = jest.fn(async () => ({
        departments: [{ id: 1 }, { id: 2 }],
        error: null,
      }));
      const facilitySpy = jest.fn(async () => ({
        facility: { id: expectedFacilityId, name: "Test Hospital" },
        error: null,
      }));
      const visitTotalsSpy = jest.fn().mockReturnValue({
        hospitals: [
          { id: 1, name: "Test Hospital", totalVisits: 10 },
          { id: 2, name: "Test Hospital", totalVisits: 3 },
        ],
        leastVisited: [{ id: 2, name: "Test Hospital", totalVisits: 3 }],
        mostVisited: [{ id: 1, name: "Test Hospital", totalVisits: 10 }],
      });
      const hospitalWardTotalsSpy = jest.fn().mockReturnValue({
        wards: { 1: 10, 2: 5 },
        mostVisited: { wardName: "Most Visited", total_visits: 10 },
        leastVisited: { wardName: "Least Visited", total_visits: 5 },
      });
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveActiveDepartmentsByFacilityId: () => departmentsSpy,
        getRetrieveFacilityByUuid: () => facilitySpy,
        getRetrieveHospitalVisitTotals: () => visitTotalsSpy,
        getRetrieveHospitalWardVisitTotals: () => hospitalWardTotalsSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        params: { hospitalUuid: expectedFacilityUuid },
        container,
      });
      // Assert
      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
      expect(facilitySpy).toHaveBeenCalledWith(expectedFacilityUuid);
      expect(departmentsSpy).toHaveBeenCalledWith(expectedFacilityId);
      expect(visitTotalsSpy).toHaveBeenCalledWith(orgId);
      expect(hospitalWardTotalsSpy).toHaveBeenCalledWith(expectedFacilityId);
      expect(props.wards).toEqual([{ id: 1 }, { id: 2 }]);
      expect(props.hospital).toEqual({
        id: expectedFacilityId,
        name: "Test Hospital",
      });
      expect(props.totalBookedVisits).toEqual(10);
      expect(props.mostVisitedWard).toEqual({
        wardName: "Most Visited",
        total_visits: 10,
      });
      expect(props.leastVisitedWard).toEqual({
        wardName: "Least Visited",
        total_visits: 5,
      });
      expect(props.wardVisitTotals).toEqual({ 1: 10, 2: 5 });
      expect(props.error).toBeNull();
    });
  });
});
