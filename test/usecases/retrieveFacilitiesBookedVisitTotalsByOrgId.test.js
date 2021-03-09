import retrieveFacilitiesBookedVisitTotalsByOrgId from "../../src/usecases/retrieveFacilitiesBookedVisitTotalsByOrgId";
import container from "src/containers/AppContainer";

describe("retrieveFacilitiesBookedVisitTotalsByOrgId", () => {
    // Arrange
    const expectedOrgId = 1;
    const expectedFacilities = [
        { id: 1, name: "Hospital 1", total: 10 },
        { id: 2, name: "Hospital 2", total: 0  },
        { id: 3, name: "Hospital 3", total: 7  },
        { id: 4, name: "Hospital 4", total: 9  }
    ];
    const getRetrieveFacilitiesBookedVisitTotalsByOrgIdSpy = jest.fn().mockResolvedValue(expectedFacilities);
    container.getRetrieveFacilitiesBookedVisitTotalsByOrgIdGateway.mockImplementation(
        () => getRetrieveFacilitiesBookedVisitTotalsByOrgIdSpy
    );

    it("returns the correct object", async () => {
        const { facilities, mostVisitedList, leastVisitedList, error } = await retrieveFacilitiesBookedVisitTotalsByOrgId(container)(
        expectedOrgId
        );
        expect(getRetrieveFacilitiesBookedVisitTotalsByOrgIdSpy).toBeCalledWith(expectedOrgId);
        expect(facilities).toEqual(expectedFacilities);
        expect(mostVisitedList).toEqual([expectedFacilities[0], expectedFacilities[3], expectedFacilities[2]]);
        expect(leastVisitedList).toEqual([expectedFacilities[1], expectedFacilities[2], expectedFacilities[3]]);
        expect(error).toBeNull();
    });
 
    it("returns an error object if orgId is undefined", async () => {
        // Act
        const { facilities, error } = await retrieveFacilitiesBookedVisitTotalsByOrgId(container)();
        // Assert
        expect(error).toEqual("organisation id must be provided.");
        expect(facilities).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveFacilitiesBookedVisitTotalsByOrgIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error"); })
        );
        
        // Act
        const { facilities, error } = await retrieveFacilitiesBookedVisitTotalsByOrgId(container)(
            expectedOrgId
        );
        // Assert
        expect(error).toEqual("There has been error retrieving total booked visits for facilities.");
        expect(facilities).toBeNull();
    });
});
