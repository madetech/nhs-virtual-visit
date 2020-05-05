import retrieveWardVisitTotals from "./retrieveWardVisitTotals";

describe("retrieveWardVisitTotals", () => {
  describe("Given no visits", () => {
    it("Returns 0 overall total", async () => {
      const anySpy = jest.fn(async () => []);

      const container = {
        getDb: async () => ({
          any: anySpy,
        }),
      };

      const response = await retrieveWardVisitTotals(container)();

      expect(anySpy).toHaveBeenCalled();
      expect(response).toEqual({ total: 0, byWard: [] });
    });
  });

  describe("Given some visits", () => {
    it("Returns the totals per ward and the overall total", async () => {
      const anySpy = jest.fn(async () => [
        { hospital_name: "Hospital One", name: "Ward One", total_visits: "10" },
        { hospital_name: "Hospital One", name: "Ward Two", total_visits: "20" },
      ]);

      const container = {
        getDb: async () => ({
          any: anySpy,
        }),
      };

      let res = await retrieveWardVisitTotals(container)();

      expect(anySpy).toHaveBeenCalled();
      expect(res).toEqual({
        total: 30,
        byWard: [
          { hospitalName: "Hospital One", name: "Ward One", visits: 10 },
          { hospitalName: "Hospital One", name: "Ward Two", visits: 20 },
        ],
      });
    });
  });
});
