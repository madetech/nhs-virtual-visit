import retrieveTotalCompletedVisitsByOrgOrFacilityId from "../../src/usecases/retrieveTotalCompletedVisitsByOrgOrFacilityId";
import container from "src/containers/AppContainer";

describe("retrieveTotalCompletedVisitsByOrgOrFacilityId", () => {
    // Arrange
    const expectedOrgId = 1;
    const expectedTotal = 10;

    const getRetrieveTotalCompletedVisitsByOrgOrFacilityIdSpy = jest.fn().mockResolvedValue(expectedTotal);
    container.getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway.mockImplementation(
        () => getRetrieveTotalCompletedVisitsByOrgOrFacilityIdSpy
    );

    it("returns the correct object when given valid orgId", async () => {
        const { total, error } = await retrieveTotalCompletedVisitsByOrgOrFacilityId(container)({
            orgId: expectedOrgId
        });
        expect(getRetrieveTotalCompletedVisitsByOrgOrFacilityIdSpy).toBeCalledWith({id: { orgId: expectedOrgId } });
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
 
    it("returns an error object if orgId is undefined", async () => {
        // Act
        const { total, error } = await retrieveTotalCompletedVisitsByOrgOrFacilityId(container)({id: { orgId: undefined }});
        // Assert
        expect(error).toEqual("Id type is invalid or undefined!");
        expect(total).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { total, error } = await retrieveTotalCompletedVisitsByOrgOrFacilityId(container)({
            orgId: expectedOrgId
        });
        // Assert
        expect(error).toEqual("Error: error!");
        expect(total).toBeNull();
    });
});
