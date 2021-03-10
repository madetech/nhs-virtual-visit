import retrieveTotalBookedVisitsForDepartmentsByFacilityId from "../../src/usecases/retrieveTotalBookedVisitsForDepartmentsByFacilityId";
import container from "src/containers/AppContainer";

describe("retrieveTotalBookedVisitsForDepartmentsByFacilityId", () => {
    // Arrange
    const expectedFacilityId = 1;
    let getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdSpy;
    container.getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway.mockImplementation(
        () => getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdSpy
    );

    it("returns the correct object", async () => {
        // Arrange
        const expectedDepartments = [
            { id: 1, name: "Ward 1", total: 10 },
            { id: 2, name: "Ward 2", total: 0  },
            { id: 3, name: "Ward 3", total: 7  },
            { id: 4, name: "Ward 4", total: 9  }
        ];
        getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdSpy = jest.fn().mockResolvedValue(expectedDepartments);
        // Act
        const { departments, mostVisited, leastVisited, error } = await retrieveTotalBookedVisitsForDepartmentsByFacilityId(container)(
        expectedFacilityId
        );
        expect(getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdSpy).toBeCalledWith(expectedFacilityId);
        expect(departments).toEqual(expectedDepartments);
        expect(mostVisited).toEqual(expectedDepartments[0]);
        expect(leastVisited).toEqual(expectedDepartments[1]);
        expect(error).toBeNull();
    });
    it("returns an error if department array is undefined", async () => {
        // Arrange
        const expectedDepartments = undefined;
        getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdSpy = jest.fn().mockResolvedValue(expectedDepartments);
        // Act
        const { error } = await retrieveTotalBookedVisitsForDepartmentsByFacilityId(container)(
        expectedFacilityId
        );
        expect(getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdSpy).toBeCalledWith(expectedFacilityId);
        expect(error).toEqual("RequestError: Cannot retrieve departments!");
    });
 
    it("returns an error object if facilityId is undefined", async () => {
        // Act
        const { departments, error } = await retrieveTotalBookedVisitsForDepartmentsByFacilityId(container)();
        // Assert
        expect(error).toEqual("facility id must be provided.");
        expect(departments).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { departments, error } = await retrieveTotalBookedVisitsForDepartmentsByFacilityId(container)(
            expectedFacilityId
        );
        // Assert
        expect(error).toEqual("Error: error!");
        expect(departments).toBeNull();
    });
});
