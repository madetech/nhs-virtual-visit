import { getServerSideProps } from "../../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/edit-ward-success";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../../../../../src/helpers/userTypes";

describe("/trust-admin/hospitals/[hospitalUuid]/wards/[warduuid]/edit-ward-success", () => {
  let res;
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
    describe("if authenticated", () => {
      // Arrange
      const orgId = 1;
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedFacilityUuid = "hospitalUuid";
      const expectedDepartmentUuid = "wardUuid";
      const expectedFacilityName = "facility name";
      const expectedDepartment = { name: "Department One" };
      const expectedOrganisation = { name: "Doggo Trust" };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: expectedOrganisation,
        error: null,
      }));
      const retrieveDepartmentByUuidSpy = jest.fn().mockReturnValue({
        department: expectedDepartment,
        error: null,
      });
      mockAppContainer.getTokenProvider().validate.mockImplementation(() => ({
        type: TRUST_ADMIN,
        trustId: orgId,
      }));
      mockAppContainer.getRetrieveOrganisationById.mockImplementation(
        () => retrieveOrganisationByIdSpy
      );
      mockAppContainer.getRetrieveDepartmentByUuid.mockImplementation(
        () => retrieveDepartmentByUuidSpy
      );
      it("returns error is null, name, hospitalName, hospitalUuid, organisation in props", async () => {
        // Act
        const {
          props: { name, hospitalName, hospitalUuid, organisation, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: { hospitalName: expectedFacilityName },
          params: {
            hospitalUuid: expectedFacilityUuid,
            wardUuid: expectedDepartmentUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
        expect(retrieveDepartmentByUuidSpy).toHaveBeenCalledWith(
          expectedDepartmentUuid
        );
        expect(name).toEqual(expectedDepartment.name);
        expect(organisation).toEqual(expectedOrganisation);
        expect(hospitalName).toEqual(expectedFacilityName);
        expect(hospitalUuid).toEqual(expectedFacilityUuid);
        expect(error).toBeNull();
      });
      it("returns an error if ward name cannot be retrieved", async () => {
        // Arrange
        const retrieveDepartmentByUuidSpy = jest.fn().mockResolvedValue({
          department: null,
          error: "ward name Error!",
        });
        mockAppContainer.getRetrieveDepartmentByUuid.mockImplementationOnce(
          () => retrieveDepartmentByUuidSpy
        );
        const {
          props: { name, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: { hospitalName: expectedFacilityName },
          params: {
            wardUuid: expectedDepartmentUuid,
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(name).toBeUndefined();
        expect(error).toEqual("ward name Error!");
      });
      it("returns an error if organisation cannot be retrieved", async () => {
        // Arrange
        const retrieveOrganisationByIdSpy = jest.fn().mockResolvedValue({
          organisation: null,
          error: "organisation name Error!",
        });
        mockAppContainer.getRetrieveOrganisationById.mockImplementationOnce(
          () => retrieveOrganisationByIdSpy
        );
        const {
          props: { organisation, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: { hospitalName: expectedFacilityName },
          params: {
            wardUuid: expectedDepartmentUuid,
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(organisation).toBeNull();
        expect(error).toEqual("organisation name Error!");
      });
      it("returns an error if hospitalName is undefined", async () => {
        // Act
        const {
          props: { hospitalName, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {},
          params: {
            wardUuid: expectedDepartmentUuid,
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(hospitalName).toBeUndefined();
        expect(error).toEqual(true);
      });
      it("returns an error if hospitalUuid is undefined", async () => {
        // Act
        const {
          props: { hospitalUuid, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: { hospitalName: expectedFacilityName },
          params: {
            wardUuid: expectedDepartmentUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(hospitalUuid).toBeUndefined();
        expect(error).toEqual(true);
      });
      it("returns an error if wardUuid is undefined", async () => {
        // Act
        const {
          props: { wardUuid, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: { hospitalName: expectedFacilityName },
          params: {
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(wardUuid).toBeUndefined();
        expect(error).toEqual(true);
      });
    });
  });
});
