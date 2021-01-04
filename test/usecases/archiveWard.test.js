import archiveWard from "../../src/usecases/archiveWard";
import { ARCHIVED } from "../../src/helpers/visitStatus";

describe("archiveWard", () => {
  let container;
  let updateCallStatusesByWardIdSpy = jest.fn();
  let updateWardArchiveTimeByIdSpy = jest.fn();

  beforeEach(() => {
    container = {
      getUpdateWardArchiveTimeByIdGateway: () => updateWardArchiveTimeByIdSpy,
      getUpdateCallStatusesByWardIdGateway: () => updateCallStatusesByWardIdSpy,
      getRetrieveWardById: () => (wardId, trustId) => {
        if (wardId === 1 && trustId === 1) {
          return {
            ward: {
              id: wardId,
            },
            error: null,
          };
        }
        return {
          ward: null,
          error: "Ward does not exist",
        };
      },
    };
  });

  it("returns success if a valid request and delete was successful", async () => {
    await expect(archiveWard(container)(1, 1)).resolves.toEqual({
      success: true,
      error: null,
    });
    expect(updateCallStatusesByWardIdSpy).toHaveBeenCalledWith(1, ARCHIVED);
    expect(updateWardArchiveTimeByIdSpy).toHaveBeenCalledWith(
      1,
      expect.anything()
    );
  });

  it("returns an error if ward cannot be removed from db", async () => {
    container.getUpdateWardArchiveTimeByIdGateway = () =>
      jest.fn(() => {
        throw Error();
      });

    return expect(archiveWard(container)(1, 1)).resolves.toEqual({
      success: false,
      error: "Failed to remove ward",
    });
  });

  it("returns an error if visits cannot be removed from db", async () => {
    container.getUpdateCallStatusesByWardIdGateway = () =>
      jest.fn(() => {
        throw Error();
      });

    return expect(archiveWard(container)(1, 1)).resolves.toEqual({
      success: false,
      error: "Failed to remove visits",
    });
  });

  it("returns an error if the ward does not exist", () => {
    return expect(archiveWard(container)(999, 1)).resolves.toEqual({
      success: false,
      error: "Ward does not exist",
    });
  });

  it("returns an error if the ward exists within another trust", () => {
    return expect(archiveWard(container)(1, 999)).resolves.toEqual({
      success: false,
      error: "Ward does not exist",
    });
  });
});
