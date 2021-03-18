import retrieveTotalCompletedVisitsByOrgId from "../../src/usecases/retrieveTotalCompletedVisitsByOrgId";
import container from "src/containers/AppContainer";

describe("retrieveTotalCompletedVisitsByOrgId", () => {
    // Arrange
    const expectedOrgId = 1;
    const expectedTotal = 10;

    const getRetrieveTotalCompletedVisitsByOrgIdSpy = jest.fn().mockResolvedValue(expectedTotal);
    container.getRetrieveTotalCompletedVisitsByOrgIdGateway.mockImplementation(
        () => getRetrieveTotalCompletedVisitsByOrgIdSpy
    );

    it("returns the correct object when given valid orgId", async () => {
        const { total, error } = await retrieveTotalCompletedVisitsByOrgId(container)(
            expectedOrgId
        );
        expect(getRetrieveTotalCompletedVisitsByOrgIdSpy).toBeCalledWith({orgId: expectedOrgId, status: undefined });
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
 
    it("returns an error object if orgId is undefined", async () => {
        // Act
        const { total, error } = await retrieveTotalCompletedVisitsByOrgId(container)();
        // Assert
        expect(error).toEqual("organisation id must be provided.");
        expect(total).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalCompletedVisitsByOrgIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { total, error } = await retrieveTotalCompletedVisitsByOrgId(container)(
            expectedOrgId
        );
        // Assert
        expect(error).toEqual("Error: error!");
        expect(total).toBeNull();
    });
});
