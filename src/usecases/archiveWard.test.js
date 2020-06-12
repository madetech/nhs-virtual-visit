import moment from "moment";
import archiveWard from "./archiveWard";

describe("archiveWard", () => {
  let container;
  let resultSpy = jest.fn().mockReturnValue({ rowCount: 1 });

  beforeEach(() => {
    container = {
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
      getDb: () =>
        Promise.resolve({
          result: resultSpy,
        }),
    };
  });

  it("returns success if a valid request and delete was successful", async () => {
    const timeBefore = moment();
    await expect(archiveWard(container)(1, 1)).resolves.toEqual({
      success: true,
      error: null,
    });
    expect(resultSpy).toHaveBeenCalledWith(
      expect.stringMatching(/UPDATE scheduled_calls_table/i),
      [1]
    );
    const [sql, [wardId, date]] = resultSpy.mock.calls[1];
    expect(sql).toMatch(/update wards/i), expect(wardId).toEqual(1);
    expect(moment(date).isAfter(timeBefore));
  });

  it("returns an error if ward cannot be removed from db", async () => {
    resultSpy.mockResolvedValueOnce({}).mockRejectedValueOnce({ error: true });

    return expect(archiveWard(container)(1, 1)).resolves.toEqual({
      success: false,
      error: "Failed to remove ward",
    });
  });

  it("returns an error if visits cannot be removed from db", async () => {
    resultSpy.mockRejectedValueOnce({ error: true });

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
