import retrieveTotalBookedVisitsByFacilityId from "../../src/usecases/retrieveTotalVisitsByStatusAndFacilityId";
import container from "src/containers/AppContainer";

describe("retrieveTotalBookedVisitsByFacilityId", () => {
    // Arrange
    const expectedFacilityId = 1;
    const expectedTotal = 10;

    const getRetrieveTotalBookedVisitsByFacilityIdSpy = jest.fn().mockResolvedValue(expectedTotal);
    container.getRetrieveTotalBookedVisitsByFacilityIdGateway.mockImplementation(
        () => getRetrieveTotalBookedVisitsByFacilityIdSpy
    );

    it("returns the correct object", async () => {
        const { total, error } = await retrieveTotalBookedVisitsByFacilityId(container)(
            expectedFacilityId
        );
        expect(getRetrieveTotalBookedVisitsByFacilityIdSpy).toBeCalledWith(expectedFacilityId);
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
 
    it("returns an error object if facilityId is undefined", async () => {
        // Act
        const { total, error } = await retrieveTotalBookedVisitsByFacilityId(container)();
        // Assert
        expect(error).toEqual("facility id must be provided.");
        expect(total).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalBookedVisitsByFacilityIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { total, error } = await retrieveTotalBookedVisitsByFacilityId(container)(
            expectedFacilityId
        );
        // Assert
        expect(error).toEqual("Error: error!");
        expect(total).toBeNull();
    });
});
