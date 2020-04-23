import { getServerSideProps } from "../../pages/wards/[id]/visits";

jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123" }
);

jest.mock("pg-promise", () => () => () => ({ any: () => [{ id: 1 }] }));

beforeAll(() => {
  process.env.JWT_SIGNING_KEY = "test-key";
});

describe("ward/[id]/visits", () => {
  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      const req = {
        headers: {
          cookie: "",
        },
      };

      const res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      };

      await getServerSideProps({ req, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });

    it("provides the visit records from the database", async () => {
      const req = {
        headers: {
          cookie: "token=234",
        },
      };

      const res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      };

      const { props } = await getServerSideProps({
        req,
        res,
        query: {
          id: "ward-id",
        },
      });
      expect(res.writeHead).not.toHaveBeenCalled();

      expect(props.error).toBeNull();
      expect(props.scheduledCalls).toHaveLength(1);
      expect(props.scheduledCalls[0]).toMatchObject({
        id: 1,
      });
    });

    it.todo("provides an error if a db error occurs");
  });
});
