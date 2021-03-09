import retrieveTotalBookedVisitsByOrgId from "../../src/usecases/retrieveTotalBookedVisitsByOrgId";
import container from "src/containers/AppContainer";

describe("retrieveTotalBookedVisitsByOrgId", () => {
    // Arrange
    const expectedOrgId = 1;
    const expectedTotal = 10;

    const getRetrieveTotalBookedVisitsByOrgIdSpy = jest.fn().mockResolvedValue(expectedTotal);
    container.getRetrieveTotalBookedVisitsByOrgIdGateway.mockImplementation(
        () => getRetrieveTotalBookedVisitsByOrgIdSpy
    );

    it("returns the correct object", async () => {
        const { total, error } = await retrieveTotalBookedVisitsByOrgId(container)(
            expectedOrgId
        );
        expect(getRetrieveTotalBookedVisitsByOrgIdSpy).toBeCalledWith(expectedOrgId);
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
 
    it("returns an error object if orgId is undefined", async () => {
        // Act
        const { total, error } = await retrieveTotalBookedVisitsByOrgId(container)();
        // Assert
        expect(error).toEqual("organisation id must be provided.");
        expect(total).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalBookedVisitsByOrgIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { total, error } = await retrieveTotalBookedVisitsByOrgId(container)(
            expectedOrgId
        );
        // Assert
        expect(error).toEqual("Error: error!");
        expect(total).toBeNull();
    });
});
