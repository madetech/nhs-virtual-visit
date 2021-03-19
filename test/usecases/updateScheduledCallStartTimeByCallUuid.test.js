import updateScheduledCallStartTimeByCallUuid from "../../src/usecases/updateScheduledCallStartTimeByCallUuid";
import container from "src/containers/AppContainer";

describe("updateScheduledCallStartTimeByCallUuid", () => {
    const callUuid = "callUuid";
    const startTime = Date.now()
    let getUpdateScheduledCallStartTimeByCallUuidGatewaySpy = jest.fn().mockResolvedValue({
            uuid: callUuid,
            start_time: startTime,
    });
    beforeEach (() => {
        container.getUpdateScheduledCallStartTimeByCallUuidGateway.mockImplementation(
            () => getUpdateScheduledCallStartTimeByCallUuidGatewaySpy
        )
    })
    it("updates the start_time column in the scheduled call database, and returns a visit object when given a call uuid", async () => {
        // Act
        const { visit, error } = await updateScheduledCallStartTimeByCallUuid(container)(callUuid);
        // Assert
        expect(visit.uuid).toEqual(callUuid);
        expect(visit.start_time).toEqual(startTime);
        expect(error).toBeNull();
    });
    it("returns an error when given call uuid is undefined", async () => {
        // Act
        const { visit, error } = await updateScheduledCallStartTimeByCallUuid(container)();
        // Assert
        expect(visit).toBeNull();
        expect(error).toEqual("Call uuid must be provided.");
    });

    it("returns an error when given an invalid call uuid", async () => {
        // Arrange
        const invalidCallUuid = "invalid";
        getUpdateScheduledCallStartTimeByCallUuidGatewaySpy = jest.fn().mockResolvedValue(undefined);
        // Act
        const { visit, error } = await updateScheduledCallStartTimeByCallUuid(container)(invalidCallUuid);
        // Assert
        expect(visit).toBeNull();
        expect(error).toEqual("There was an error updating the visit start time: Scheduled call does not exist!");
    });
    it("returns an error when database retrieval throws an error", async () => {
        // Arrange
        getUpdateScheduledCallStartTimeByCallUuidGatewaySpy = jest.fn().mockImplementation(() => {
            throw new Error("Database retrieval error!")
        });
        // Act
        const { visit, error } = await updateScheduledCallStartTimeByCallUuid(container)(callUuid);
        // Assert
        expect(visit).toBeNull();
        expect(error).toEqual("There was an error updating the visit start time: Error: Database retrieval error!");
    });

})