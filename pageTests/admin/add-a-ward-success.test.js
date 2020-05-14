import { getServerSideProps } from "../../pages/admin/add-a-ward-success";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/adminIsAuthenticated", () => () => (token) =>
  token && { admin: true, trustId: 1 }
);

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

describe("/admin/add-a-ward-success", () => {
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

    describe("with wardId parameter", () => {
      it("retrieves a ward by the wardId parameter", async () => {
        const retrieveWardByIdSpy = jest.fn().mockReturnValue({
          ward: {
            id: 1,
            name: "Defoe Ward",
            hospitalName: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveWardById: () => retrieveWardByIdSpy,
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            wardId: "ward ID",
          },
          container,
        });

        expect(retrieveWardByIdSpy).toHaveBeenCalledWith("ward ID", 1);
      });

      it("set a ward prop based on the retrieved ward", async () => {
        const retrieveWardByIdSpy = jest.fn().mockReturnValue({
          ward: {
            id: 1,
            name: "Defoe Ward",
            hospitalName: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveWardById: () => retrieveWardByIdSpy,
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            wardId: "1",
          },
          container,
        });

        expect(props.name).toEqual("Defoe Ward");
        expect(props.hospitalName).toEqual("Northwick Park Hospital");
      });
    });
  });
});
