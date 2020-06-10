import AppContainer from "../containers/AppContainer";

async function createTestWards(trustId, hospitalId, count) {
  const container = AppContainer.getInstance();

  for (let i = 1; i <= count; i++) {
    const id = hospitalId + ":" + i;
    const { wardId } = await container.getCreateWard()({
      name: "Test Ward " + id,
      code: "wardCode" + id,
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const date1 = new Date("2020-06-01 13:00");
    const date2 = new Date("2020-06-02 13:00");

    await container.getUpdateWardVisitTotals()({
      wardId: wardId,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: wardId,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: wardId,
      date: date2.toISOString(),
    });
  }
}

async function createTestHospitals(trustId, count) {
  const container = AppContainer.getInstance();

  let ids = [];

  for (let i = 1; i <= count; i++) {
    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital " + i,
      trustId: trustId,
    });
    ids.push(hospitalId);

    await createTestWards(trustId, hospitalId, i);
  }

  return ids;
}

function isAscending(nums) {
  return !!nums.reduce((n, item) => n !== false && item >= n && item);
}

function isDescending(nums) {
  return isAscending(nums.reverse());
}

describe("retrieveHospitalVisitTotals contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the total number of visits for each hospital", async () => {
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

    const hospitalIds = await createTestHospitals(trustId, 4);

    const {
      hospitals,
      mostVisited,
      leastVisited,
    } = await container.getRetrieveHospitalVisitTotals()(trustId);

    expect(hospitals.length).toBe(4);

    const hospital1 = hospitals.find(({ id }) => id === hospitalIds[0]);
    const hospital2 = hospitals.find(({ id }) => id === hospitalIds[1]);

    expect(hospital1.name).toBe("Test Hospital 1");
    expect(hospital2.name).toBe("Test Hospital 2");
    expect(hospital1.totalVisits).toEqual(3);
    expect(hospital2.totalVisits).toEqual(6);

    expect(leastVisited.length).toBe(3);
    expect(mostVisited.length).toBe(3);

    const leastTotals = leastVisited.map((hospital) => hospital.totalVisits);
    expect(isAscending(leastTotals)).toBeTruthy();

    const mostTotals = mostVisited.map((hospital) => hospital.totalVisits);
    expect(isDescending(mostTotals)).toBeTruthy();
  });

  it("returns an empty object if no trustId is provided", async () => {
    const { hospitals } = await container.getRetrieveHospitalVisitTotals()();
    expect(hospitals).toEqual([]);
  });

  it("returns an empty object if the trustId does not exist", async () => {
    const { hospitals } = await container.getRetrieveHospitalVisitTotals()(12);
    expect(hospitals).toEqual([]);
  });
});
