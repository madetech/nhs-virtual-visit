import { getServerSideProps } from "../../pages/wards/[id]/visits";

jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123" }
);

beforeAll(() => {
  process.env.JWT_SIGNING_KEY = "test-key";
});

describe("ward/[id]/visits", () => {
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

    it("provides the visit records from the database", async () => {
      const container = {
        getDb: () =>
          Promise.resolve({
            any: () => [{ id: 1 }, { id: 2 }],
          }),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "ward-id",
        },
        container,
      });
      expect(res.writeHead).not.toHaveBeenCalled();

      expect(props.error).toBeNull();
      expect(props.scheduledCalls).toHaveLength(2);
      expect(props.scheduledCalls[0]).toMatchObject({
        id: 1,
      });
      expect(props.scheduledCalls[1]).toMatchObject({
        id: 2,
      });
    });

    it("provides an error if a db error occurs", async () => {
      const container = {
        getDb: () =>
          Promise.resolve({
            any: () => {
              throw new Error("Some DB Error");
            },
          }),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {
          id: "ward-id",
        },
        container,
      });

      expect(props.scheduledCalls).toBeNull();
      expect(props.error).not.toBeNull();
    });
  });
});
