import retrieveTotalVisitsByStatusAndFacilityId from "../../src/usecases/retrieveTotalVisitsByStatusAndFacilityId";
import container from "src/containers/AppContainer";
import { COMPLETE } from "../../src/helpers/visitStatus";

describe("retrieveTotalVisitsByStatusAndFacilityId", () => {
    // Arrange
    const expectedFacilityId = 1;
    const expectedTotal = 10;

    let getRetrieveTotalVisitsByStatusAndFacilityIdSpy = jest.fn().mockResolvedValue(expectedTotal);
    container.getRetrieveTotalVisitsByStatusAndFacilityIdGateway.mockImplementation(
        () => getRetrieveTotalVisitsByStatusAndFacilityIdSpy
    );

    it("returns the correct total when given a facilityId but no status", async () => {
        const { total, error } = await retrieveTotalVisitsByStatusAndFacilityId(container)(
            expectedFacilityId
        );
        expect(getRetrieveTotalVisitsByStatusAndFacilityIdSpy).toBeCalledWith({ facilityId: expectedFacilityId });
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
    it("returns the correct total when given a facilityId and a status", async () => {
        
        const { total, error } = await retrieveTotalVisitsByStatusAndFacilityId(container)(
            expectedFacilityId,
            COMPLETE
        );
        expect(getRetrieveTotalVisitsByStatusAndFacilityIdSpy).toBeCalledWith({ facilityId: expectedFacilityId, status: COMPLETE });
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
 
    it("returns an error object if facilityId is undefined", async () => {
        // Act
        const { total, error } = await retrieveTotalVisitsByStatusAndFacilityId(container)();
        // Assert
        expect(error).toEqual("facility id must be provided.");
        expect(total).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalVisitsByStatusAndFacilityIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { total, error } = await retrieveTotalVisitsByStatusAndFacilityId(container)(
            expectedFacilityId
        );
        // Assert
        expect(error).toEqual("Error: error!");
        expect(total).toBeNull();
    });
});
