import updateHospital from "./updateHospital";
import AppContainer from "../containers/AppContainer";
import { setupTrust } from "../testUtils/factories";

describe("updateHospital contract tests", () => {
  const container = AppContainer.getInstance();

  it("updates a hospital in the db when valid", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const request = {
      name: "Test Hospital 2",
      id: hospitalId,
    };

    const { id: updatedHospitalId, error } = await updateHospital(container)(
      request
    );

    const { hospital } = await container.getRetrieveHospitalById()(
      updatedHospitalId,
      trustId
    );

    expect(hospital).toEqual({
      id: hospitalId,
      name: "Test Hospital 2",
    });

    expect(error).toBeNull();
  });
});
