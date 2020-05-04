import { getServerSideProps } from "../../pages/wards/visits";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123", wardId: 1 }
);

describe("ward/visits", () => {
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

    it("provides the visit and a ward record from the database", async () => {
      const visitsSpy = jest.fn(async () => ({
        scheduledCalls: [{ id: 1 }, { id: 2 }],
        error: null,
      }));
      const wardSpy = jest.fn(async () => ({
        ward: { id: 1 },
        error: null,
      }));
      const container = {
        getRetrieveVisits: () => visitsSpy,
        getWardById: () => wardSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {},
        container,
      });
      expect(res.writeHead).not.toHaveBeenCalled();

      expect(visitsSpy).toHaveBeenCalledWith({ wardId: 1 });
      expect(wardSpy).toHaveBeenCalledWith(1);
      expect(props.error).toBeNull();
      expect(props.scheduledCalls).toHaveLength(2);
      expect(props.scheduledCalls[0]).toMatchObject({
        id: 1,
      });
      expect(props.scheduledCalls[1]).toMatchObject({
        id: 2,
      });
      expect(props.error).toBeNull();
      expect(props.ward).toMatchObject({
        id: 1,
      });
    });

    it("provides an error if a db error occurs", async () => {
      const retrieveVisitsStub = async () => ({
        scheduledCalls: null,
        error: "Error",
      });
      const getWardByIdStub = async () => ({
        ward: null,
        error: "Error",
      });
      const container = {
        getRetrieveVisits: () => retrieveVisitsStub,
        getWardById: () => getWardByIdStub,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {},
        container,
      });

      expect(props.scheduledCalls).toBeNull();
      expect(props.ward).toBeNull();
      expect(props.error).not.toBeNull();
    });
  });
});
