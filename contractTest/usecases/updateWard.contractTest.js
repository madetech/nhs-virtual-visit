import updateWard from "../../src/usecases/updateWard";
import AppContainer from "../../src/containers/AppContainer";
import { setupTrust } from "../../test/testUtils/factories";

describe("updateWard contract tests", () => {
  const container = AppContainer.getInstance();

  it("updates a ward in the db when valid", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId: existingWardId } = await container.getCreateWard()({
      name: "Test Ward",
      code: "wardCode",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const request = {
      name: "Test Ward 2",
      hospitalId: hospitalId,
      id: existingWardId,
    };

    const { wardId: updatedWardId, error } = await updateWard(container)(
      request
    );

    const { ward } = await container.getRetrieveWardById()(
      updatedWardId,
      trustId
    );

    expect(ward).toEqual({
      id: existingWardId,
      name: "Test Ward 2",
      hospitalId: hospitalId,
      hospitalName: "Test Hospital",
    });

    expect(error).toBeNull();
  });
});
