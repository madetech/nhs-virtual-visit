import { getServerSideProps } from "../../../../../pages/trust-admin/hospitals/[id]/add-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

const tokenProvider = {
  validate: jest.fn(() => ({ type: "trustAdmin", trustId: 1 })),
};

describe("/trust-admin/hospitals/[id]/add-success", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  let res;

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/trust-admin/login",
      });
    });

    describe("with hospitalId parameter", () => {
      it("retrieves a hospital by the hospitalId parameter", async () => {
        const retrieveTrustByIdSpy = jest.fn(async () => ({
          trust: { name: "Doggo Trust" },
          error: null,
        }));

        const retrieveHospitalByIdSpy = jest.fn().mockReturnValue({
          hospital: {
            id: 1,
            name: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
          getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
          getTokenProvider: () => tokenProvider,
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            id: "hospital ID",
          },
          container,
        });

        expect(retrieveHospitalByIdSpy).toHaveBeenCalledWith("hospital ID", 1);
      });

      it("set a hospital prop based on the retrieved hospital", async () => {
        const retrieveTrustByIdSpy = jest.fn(async () => ({
          trust: { name: "Doggo Trust" },
          error: null,
        }));

        const retrieveHospitalByIdSpy = jest.fn().mockReturnValue({
          hospital: {
            id: 1,
            name: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveTrustById: () => retrieveTrustByIdSpy,
          getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
          getTokenProvider: () => tokenProvider,
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            hospitalId: "hospital ID",
          },
          container,
        });

        expect(props.name).toEqual("Northwick Park Hospital");
      });
    });
  });
});
