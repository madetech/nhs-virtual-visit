import { getServerSideProps } from "../../../../../pages/trust-admin/hospitals/[id]/edit";

describe("/trust-admin/hospitals/[id]/edit", () => {
  // Arrange
  let res;
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
        Location: "/trust-admin/login",
      });
    });

    it("retrieves the hospital by ID", async () => {
      // Arrange
      const orgId = 1;
      const tokenProvider = {
        validate: jest.fn(() => ({ type: "trustAdmin", trustId: orgId })),
      };

      const hospitalId = 2;
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: "Doggo Trust" },
        error: null,
      }));
      const retrieveHospitalByIdSpy = jest.fn().mockResolvedValue({
        hospital: {
          id: hospitalId,
          name: "Northwick Park Hospital",
          surveyUrl: "https://www.survey.example.com",
          supportUrl: "https://www.support.example.com",
        },
        error: null,
      });
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      await getServerSideProps({
        req: authenticatedReq,
        res,
        query: { id: hospitalId },
        container,
      });
      // Assert
      expect(retrieveHospitalByIdSpy).toHaveBeenCalledWith(hospitalId, orgId);
    });
  });
});
