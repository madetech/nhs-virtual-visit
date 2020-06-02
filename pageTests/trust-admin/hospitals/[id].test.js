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

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: 1 })),
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
        hospital: { name: "Test Hospital" },
        error: null,
      }));

      const container = {
        getRetrieveWardsByHospitalId: () => wardsSpy,
        getRetrieveHospitalById: () => hospitalSpy,
        getRetrieveHospitalVisitTotals: () => jest.fn().mockReturnValue({}),
        getTokenProvider: () => tokenProvider,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: { id: hospitalId },
        container,
      });

      expect(hospitalSpy).toHaveBeenCalledWith(hospitalId, 1);
      expect(props.wards).toEqual([{ id: 1 }, { id: 2 }]);
      expect(props.hospital).toEqual({ name: "Test Hospital" });
    });
  });
});
