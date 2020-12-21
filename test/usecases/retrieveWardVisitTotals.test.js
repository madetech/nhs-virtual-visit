import retrieveWardVisitTotals from "../../src/usecases/retrieveWardVisitTotals";

describe("retrieveWardVisitTotals", () => {
  describe("No trustId specified", () => {
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

  describe("Given no visits", () => {
    it("Returns 0 overall total", async () => {
      const anySpy = jest.fn(async () => []);

      const container = {
        getDb: async () => ({
          any: anySpy,
          trustId: 0,
        }),
      };

      const response = await retrieveWardVisitTotals(container)();

      expect(anySpy).toHaveBeenCalled();
      expect(response).toEqual({ total: 0, byWard: [] });
    });
  });

  describe("Given some visits", () => {
    it("Returns the totals per ward and the overall total for all trusts", async () => {
      const anySpy = jest.fn(async () => [
        {
          hospital_name: "Hospital One",
          name: "Ward One",
          total_visits: "10",
          trust_id: 0,
        },
        {
          hospital_name: "Hospital One",
          name: "Ward Two",
          total_visits: "20",
          trust_id: 1,
        },
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
          {
            hospitalName: "Hospital One",
            name: "Ward One",
            visits: 10,
            trustId: 0,
          },
          {
            hospitalName: "Hospital One",
            name: "Ward Two",
            visits: 20,
            trustId: 1,
          },
        ],
      });
    });

    it("Returns the totals per ward and the overall total for the specified trust", async () => {
      const trustId = 1;
      const anySpy = jest.fn(async () => [
        {
          hospital_name: "Hospital One",
          name: "Ward Two",
          total_visits: "20",
          trust_id: trustId,
        },
      ]);

      const container = {
        getDb: async () => ({
          any: anySpy,
          trustId: trustId,
        }),
      };

      let res = await retrieveWardVisitTotals(container)(trustId);

      expect(anySpy).toHaveBeenCalled();
      expect(res).toEqual({
        total: 20,
        byWard: [
          {
            hospitalName: "Hospital One",
            name: "Ward Two",
            visits: 20,
            trustId: trustId,
          },
        ],
      });
    });
  });
});
