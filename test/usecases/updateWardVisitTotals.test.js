import updateWardVisitTotalsDb from "../../src/usecases/updateWardVisitTotals";

describe("updateWardVisitTotals", () => {
  const dateToInsert = "2020-05-05T10:10:10";

  it("calls getUpdateWardVisitTotalsGateway with the correct arguments", async () => {
    const dbInstanceDummy = jest.fn();
    const updateVisitTotalsSpy = jest.fn(async () => {});

    const container = {
      getDb: () => dbInstanceDummy,
      getUpdateWardVisitTotalsGateway: () => {
        return updateVisitTotalsSpy;
      },
    };

    let response = await updateWardVisitTotalsDb(container)({
      wardId: 1,
      date: dateToInsert,
    });

    expect(updateVisitTotalsSpy).toHaveBeenCalledWith(
      dbInstanceDummy,
      1,
      dateToInsert
    );
    expect(response.success).toEqual(true);
  });

  it("returns success false when gateway returns an error", async () => {
    const updateVisitTotalsSpy = jest.fn(async () => {
      throw "DB Error";
    });

    const container = {
      getDb: async () => jest.fn(),
      getUpdateWardVisitTotalsGateway: () => {
        return updateVisitTotalsSpy;
      },
    };
    let response = await updateWardVisitTotalsDb(container)({
      wardId: 1,
      date: dateToInsert,
    });

    expect(response.success).toEqual(false);
    expect(response.error).toEqual("DB Error");
  });
});
