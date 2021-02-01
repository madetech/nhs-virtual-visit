import captureEvent from "../../../src/gateways/MsSQL/captureEvent";
import AppContainer from "../../../src/containers/AppContainer";

describe("captureEvent()", () => {
  const container = AppContainer.getInstance();

  it("returns an id & timestamp", async () => {
    const {
      event: { id },
    } = await captureEvent(container)({
      action: "test",
      //we don't yet have the ability to create mssql visits so we will use a dummy value for now
      visitId: null,
      callSessionId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(id).toBeGreaterThan(0);
  });

  it("catches errors", async () => {
    const nonexistentVisitId = 25565;
    const { error } = await captureEvent(container)({
      action: "test",
      visitId: nonexistentVisitId,
      callSessionId: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(error).toEqual("Failed to add test event for visit 25565");
  });
});
