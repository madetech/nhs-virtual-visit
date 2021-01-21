import { getServerSideProps } from "../../../../pages/trust-admin/wards/archive-success";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
describe("/trust-admin/wards/archive-success", () => {
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
        Location: "/login",
      });
    });
    it("returns hospitals, hospitalId, organisation and error through props", async () => {
      // Arrange
      const orgId = 10;
      const expectedHospitalId = 1;
      const expectedHospitalName = "Hospital1";
      const expectedWardName = "Ward1";
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedOrganisationName = "Doggo Trust";
      const tokenProvider = {
        validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: { name: expectedOrganisationName },
        error: null,
      }));
      const container = {
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };
      // Act
      const {
        props: { name, hospitalName, hospitalId, organisation, error },
      } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          hospitalId: expectedHospitalId,
          hospitalName: expectedHospitalName,
          name: expectedWardName,
        },
        container,
      });
      // Assert
      expect(retrieveOrganisationByIdSpy).toBeCalledWith(orgId);
      expect(organisation.name).toEqual(expectedOrganisationName);
      expect(hospitalId).toEqual(expectedHospitalId);
      expect(hospitalName).toEqual(expectedHospitalName);
      expect(name).toEqual(expectedWardName);
      expect(error).toBeNull();
    });
  });
});
