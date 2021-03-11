import retrieveTotalVisitsByStatusAndOrgId from "../../src/usecases/retrieveTotalVisitsByStatusAndOrgId";
import container from "src/containers/AppContainer";
import { COMPLETE } from "../../src/helpers/visitStatus";

describe("retrieveTotalVisitsByStatusAndOrgId", () => {
    // Arrange
    const expectedOrgId = 1;
    const expectedTotal = 10;

    const getRetrieveTotalVisitsByStatusAndOrgIdSpy = jest.fn().mockResolvedValue(expectedTotal);
    container.getRetrieveTotalVisitsByStatusAndOrgIdGateway.mockImplementation(
        () => getRetrieveTotalVisitsByStatusAndOrgIdSpy
    );

    it("returns the correct object when no status is passed", async () => {
        const { total, error } = await retrieveTotalVisitsByStatusAndOrgId(container)(
            expectedOrgId
        );
        expect(getRetrieveTotalVisitsByStatusAndOrgIdSpy).toBeCalledWith({orgId: expectedOrgId, status: undefined });
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });

    it("returns the correct object when both status and org id is passed", async () => {
        const { total, error } = await retrieveTotalVisitsByStatusAndOrgId(container)(
            expectedOrgId,
            COMPLETE
        );
        expect(getRetrieveTotalVisitsByStatusAndOrgIdSpy).toBeCalledWith({ orgId: expectedOrgId, status: COMPLETE });
        expect(total).toEqual(expectedTotal);
        expect(error).toBeNull();
    });
 
    it("returns an error object if orgId is undefined", async () => {
        // Act
        const { total, error } = await retrieveTotalVisitsByStatusAndOrgId(container)();
        // Assert
        expect(error).toEqual("organisation id must be provided.");
        expect(total).toBeNull();
    });
    it("returns error if gateway db throws an error", async () => {
        // Act
        container.getRetrieveTotalVisitsByStatusAndOrgIdGateway.mockImplementationOnce(
            () => jest.fn(async () => { throw new Error("error!"); })
        );
        
        // Act
        const { total, error } = await retrieveTotalVisitsByStatusAndOrgId(container)(
            expectedOrgId
        );
        // Assert
        expect(error).toEqual("Error: error!");
        expect(total).toBeNull();
    });
});
