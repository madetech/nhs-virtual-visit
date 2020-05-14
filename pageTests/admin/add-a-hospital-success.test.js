import { getServerSideProps } from "../../pages/admin/add-a-hospital-success";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/adminIsAuthenticated", () => () => (token) =>
  token && { admin: true, trustId: 1 }
);

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

describe("/admin/add-a-hospital-success", () => {
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
        Location: "/wards/login",
      });
    });

    describe("with hospitalId parameter", () => {
      it("retrieves a hospital by the hospitalId parameter", async () => {
        const retrieveHospitalByIdSpy = jest.fn().mockReturnValue({
          hospital: {
            id: 1,
            name: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            hospitalId: "hospital ID",
          },
          container,
        });

        expect(retrieveHospitalByIdSpy).toHaveBeenCalledWith("hospital ID", 1);
      });

      it("set a hospital prop based on the retrieved hospital", async () => {
        const retrieveHospitalByIdSpy = jest.fn().mockReturnValue({
          hospital: {
            id: 1,
            name: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
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
