import { getServerSideProps } from "../../pages/login";

jest.mock("uuid", () => ({
  v4: () => "uuidv4",
}));

describe("login", () => {
  let res;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };

  it("redirects to trust-admin page if there is a trust-admin token", async () => {
    const container = {
      getUserIsAuthenticated: () => jest.fn(),
      getTrustAdminIsAuthenticated: () => jest.fn(async () => "trusttoken"),
      getAdminIsAuthenticated: () => jest.fn(),
    };

    await getServerSideProps({ req: authenticatedReq, res, container });

    expect(res.writeHead).toHaveBeenCalledWith(307, {
      Location: "/trust-admin",
    });
  });

  it("redirects to admin page if there is a admin token", async () => {
    const container = {
      getUserIsAuthenticated: () => jest.fn(),
      getTrustAdminIsAuthenticated: () => jest.fn(),
      getAdminIsAuthenticated: () => jest.fn(async () => "admintoken"),
    };

    await getServerSideProps({ req: authenticatedReq, res, container });

    expect(res.writeHead).toHaveBeenCalledWith(307, {
      Location: "/admin",
    });
  });

  it("redirects to wards page if there is a wards token", async () => {
    const container = {
      getUserIsAuthenticated: () =>
        jest.fn().mockResolvedValue({ ward: "my-test-ward" }),
      getTrustAdminIsAuthenticated: () => jest.fn(),
      getAdminIsAuthenticated: () => jest.fn(),
    };

    const req = { headers: { cookie: "" } };

    await getServerSideProps({ req, res, container });

    expect(res.writeHead).toHaveBeenCalledWith(307, {
      Location: "/wards/visits",
    });
  });

  it("returns the correlationId as props if there is no token", async () => {
    const container = {
      getUserIsAuthenticated: () => jest.fn(),
      getTrustAdminIsAuthenticated: () => jest.fn(),
      getAdminIsAuthenticated: () => jest.fn(),
    };

    const req = { headers: { cookie: "" } };

    const { props } = await getServerSideProps({ req, res, container });

    expect(props.correlationId).toEqual("uuidv4-admin-login");
  });
});
