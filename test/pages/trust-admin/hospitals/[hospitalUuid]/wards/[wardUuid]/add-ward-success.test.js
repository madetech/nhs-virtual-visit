import { getServerSideProps } from "../../../../../../../pages/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/add-ward-success";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../../../../../src/helpers/userTypes";

describe("/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/add-ward-success", () => {
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
      const orgId = 2;
      const expectedHospitalName = "hospitalName";
      const authenticatedReq = {
        headers: {
          cookie: "token=123",
        },
      };
      const expectedDepartmentUuid = "ward-uuid";
      const expectedFacilityUuid = "facility-uuid";
      const expectedOrganisation = { name: "Doggo Trust" };
      const expectedDepartment = {
        id: 1,
        name: "Defoe Ward",
        uuid: expectedDepartmentUuid,
      };
      const retrieveOrganisationByIdSpy = jest.fn(async () => ({
        organisation: expectedOrganisation,
        error: null,
      }));
      const retrieveDepartmentByUuidSpy = jest.fn().mockResolvedValue({
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
      it("returns ward name, hospitalName, organisation, hospitalUuid, error is null in props", async () => {
        // Act
        const {
          props: { name, hospitalName, hospitalUuid, organisation, error },
        } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: { hospitalName: expectedHospitalName },
          params: {
            wardUuid: expectedDepartmentUuid,
            hospitalUuid: expectedFacilityUuid,
          },
          container: { ...mockAppContainer },
        });
        // Assert
        expect(retrieveDepartmentByUuidSpy).toHaveBeenCalledWith(
          expectedDepartmentUuid
        );
        expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
        expect(hospitalName).toEqual(expectedHospitalName);
        expect(hospitalUuid).toEqual(expectedFacilityUuid);
        expect(organisation).toEqual(expectedOrganisation);
        expect(name).toEqual(expectedDepartment.name);
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
          query: { hospitalName: expectedHospitalName },
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
          query: { hospitalName: expectedHospitalName },
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
          query: { hospitalName: expectedHospitalName },
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
          query: { hospitalName: expectedHospitalName },
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
