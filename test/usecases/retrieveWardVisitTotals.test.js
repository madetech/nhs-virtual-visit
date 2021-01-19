import retrieveWardVisitTotals from "../../src/usecases/retrieveWardVisitTotals";

describe("retrieveWardVisitTotals", () => {
  describe("No trustId specified", () => {
    it("Returns 0 overall total", async () => {
      const anySpy = jest.fn(async () => []);

      const container = {
        getRetrieveWardVisitTotalsGateway: () => anySpy,
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
        getRetrieveWardVisitTotalsGateway: () => anySpy,
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
      ]);

      const container = {
        getRetrieveWardVisitTotalsGateway: () => anySpy,
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
          hospitalName: "Hospital One",
          name: "Ward Two",
          visits: 20,
          trustId: trustId,
        },
      ]);

      const container = {
        getRetrieveWardVisitTotalsGateway: () => anySpy,
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
