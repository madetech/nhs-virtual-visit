import { getServerSideProps } from "../pages/admin";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../src/usecases/adminIsAuthenticated", () => () => (token) =>
  token && { admin: true, trustId: 1 }
);

describe("admin", () => {
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

  const wards = [
    {
      id: 1,
      name: "Defoe Ward",
      hospital_name: "Test Hospital",
      code: "test_code",
    },
    {
      id: 2,
      name: "Willem Ward",
      hospital_name: "Test Hospital 2",
      code: "test_code_2",
    },
  ];

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

    it("retrieves wards", async () => {
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: wards,
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(getRetrieveWardsSpy).toHaveBeenCalledWith(1);
      expect(props.wards).toEqual(wards);
      expect(props.wardError).toBeNull();
    });

    it("sets an error in props if ward error", async () => {
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: null,
        error: "Error!",
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: { name: "Doggo Trust" },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.wardError).toEqual("Error!");
    });

    it("retrieves the trust of the admin", async () => {
      const trustId = 1;
      const getRetrieveWardsSpy = jest.fn(async () => ({
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: {
          id: trustId,
          name: "Doggo Trust",
        },
        error: null,
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(retrieveTrustByIdSpy).toHaveBeenCalledWith(trustId);
      expect(props.trust).toEqual({ name: "Doggo Trust" });
      expect(props.wardError).toBeNull();
    });

    it("sets an error in props if trust error", async () => {
      const getRetrieveWardsSpy = jest.fn(async () => ({
        wards: wards,
        error: null,
      }));
      const retrieveTrustByIdSpy = jest.fn(async () => ({
        trust: null,
        error: "Error!",
      }));
      const container = {
        getRetrieveWards: () => getRetrieveWardsSpy,
        getRetrieveTrustById: () => retrieveTrustByIdSpy,
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        container,
      });

      expect(props.trustError).toEqual("Error!");
    });
  });
});
