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
    it("redirects to root page if not authenticated", async () => {
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
        Location: "/",
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

      const facilitySpy = jest.fn(async () => ({
        facility: { id: expectedFacilityId, name: "Test Hospital" },
        error: null,
      }));
      const visitTotalsSpy = jest.fn().mockReturnValue({
        total: 15,
        error: null
      });
      const bookedVisitsTotalSpy = jest.fn().mockReturnValue({
        total: 20,
        error: null
      });
      const hospitalWardTotalsSpy = jest.fn().mockReturnValue({
        departments: [{ name: "Most Visited", total: 10, name: "Least Visited", total: 5  }],
        mostVisited: { name: "Most Visited", total: 10 },
        leastVisited: { name: "Least Visited", total: 5 },
      });
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveFacilityByUuid: () => facilitySpy,
        getRetrieveTotalVisitsByStatusAndFacilityId: () => bookedVisitsTotalSpy,
        getRetrieveTotalCompletedVisitsByOrgOrFacilityId: () => visitTotalsSpy,
        getRetrieveTotalBookedVisitsForDepartmentsByFacilityId: () => hospitalWardTotalsSpy,
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
      expect(visitTotalsSpy).toHaveBeenCalledWith({ facilityId: expectedFacilityId });
      expect(hospitalWardTotalsSpy).toHaveBeenCalledWith(expectedFacilityId);
      expect(props.wards).toEqual([{ name: "Most Visited", total: 10, name: "Least Visited", total: 5  }]);
      expect(props.hospital).toEqual({
        id: expectedFacilityId,
        name: "Test Hospital",
      });
      expect(props.totalBookedVisits).toEqual(20);
      expect(props.mostVisitedWard).toEqual({
        name: "Most Visited",
        total: 10,
      });
      expect(props.leastVisitedWard).toEqual({
        name: "Least Visited",
        total: 5,
      });
      expect(props.error).toBeNull();
    });
  });
});
