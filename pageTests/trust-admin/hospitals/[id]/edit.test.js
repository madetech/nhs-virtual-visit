import { getServerSideProps } from "../../../../pages/trust-admin/hospitals/[id]/edit";

describe("/trust-admin/hospitals/[id]/edit", () => {
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
    validate: jest.fn(() => ({ type: "trustAdmin", trustId })),
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
        Location: "/trust-admin/login",
      });
    });

    it("retrieves the hospital by ID", async () => {
      const hospitalId = 2;
      const retrieveHospitalByIdSpy = jest.fn().mockResolvedValue({
        hospital: {
          id: hospitalId,
          name: "Northwick Park Hospital",
          surveyUrl: "https://www.survey.example.com",
          supportUrl: "https://www.support.example.com",
        },
        error: null,
      });

      const container = {
        getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
      };

      await getServerSideProps({
        req: authenticatedReq,
        res,
        query: { id: hospitalId },
        container,
      });

      expect(retrieveHospitalByIdSpy).toHaveBeenCalledWith(hospitalId, trustId);
    });
  });
});
