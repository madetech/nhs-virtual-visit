import { updateWardVisitTotalsDb } from "./updateWardVisitTotals";

describe("updateWardVisitTotals", () => {
  const dateToInsert = "2020-05-05T10:10:10";

  describe("given no value currently exists for the ward", () => {
    it("inserts a new value for the ward and date", async () => {
      const anySpy = jest.fn(async () => []);
      const oneSpy = jest.fn(async () => 10);

      const container = {
        getDb: async () => {
          return {
            any: anySpy,
            one: oneSpy,
          };
        },
      };

      let response = await updateWardVisitTotalsDb(container)({
        wardId: 1,
        date: dateToInsert,
      });

      expect(anySpy).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [
        1,
        dateToInsert,
      ]);

      expect(oneSpy).toHaveBeenCalledWith(expect.stringContaining("INSERT"), [
        1,
        dateToInsert,
        1,
      ]);

      expect(response.success).toEqual(true);
    });
  });

  describe("given a value currently exists for the ward", () => {
    it("updates the existing value for the ward", async () => {
      const anySpy = jest.fn(async () => [{ id: 10, wardId: 1, total: 1 }]);
      const noneSpy = jest.fn(async () => {});

      const container = {
        getDb: async () => {
          return {
            any: anySpy,
            none: noneSpy,
          };
        },
      };

      let response = await updateWardVisitTotalsDb(container)({
        wardId: 1,
        date: dateToInsert,
      });

      expect(anySpy).toHaveBeenCalled();
      expect(anySpy).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [
        1,
        dateToInsert,
      ]);

      expect(noneSpy).toHaveBeenCalledWith(expect.stringContaining("UPDATE"), [
        10,
        2,
      ]);
      expect(response.success).toEqual(true);
    });
  });

  describe("DB Errors", () => {
    it("Returns success false", async () => {
      const anySpy = jest.fn(async () => {
        throw "DB Error";
      });

      const container = {
        getDb: async () => {
          return {
            any: anySpy,
          };
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
});
