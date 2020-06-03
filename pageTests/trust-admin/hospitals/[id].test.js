import { getServerSideProps } from "../../../pages/trust-admin/hospitals/[id]";

describe("trust-admin/hospitals/[id]", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };
  let res;

  const trustId = 1;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: trustId })),
  };

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });

    it("provides the hospital and wards as props", async () => {
      const hospitalId = 10;

      const wardsSpy = jest.fn(async () => ({
        wards: [{ id: 1 }, { id: 2 }],
        error: null,
      }));

      const hospitalSpy = jest.fn(async () => ({
        hospital: { id: hospitalId, name: "Test Hospital" },
        error: null,
      }));

      const visitTotalsSpy = jest.fn().mockReturnValue({ 1: 10, 2: 3 });

      const hospitalWardTotalsSpy = jest.fn().mockReturnValue({
        mostVisited: { wardName: "Most Visited", total_visits: 10 },
        leastVisited: { wardName: "Least Visited", total_visits: 5 },
      });

      const container = {
        getRetrieveWardsByHospitalId: () => wardsSpy,
        getRetrieveHospitalById: () => hospitalSpy,
        getRetrieveHospitalVisitTotals: () => visitTotalsSpy,
        getRetrieveHospitalWardVisitTotals: () => hospitalWardTotalsSpy,
        getTokenProvider: () => tokenProvider,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: { id: hospitalId },
        container,
      });

      expect(hospitalSpy).toHaveBeenCalledWith(hospitalId, trustId);
      expect(visitTotalsSpy).toHaveBeenCalledWith(trustId);
      expect(hospitalWardTotalsSpy).toHaveBeenCalledWith(hospitalId);

      expect(props.wards).toEqual([{ id: 1 }, { id: 2 }]);
      expect(props.hospital).toEqual({ id: hospitalId, name: "Test Hospital" });
      expect(props.mostVisitedWard).toEqual({
        wardName: "Most Visited",
        total_visits: 10,
      });
      expect(props.leastVisitedWard).toEqual({
        wardName: "Least Visited",
        total_visits: 5,
      });
    });
  });
});
