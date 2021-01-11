import { getServerSideProps } from "pages/trust-admin/managers/index";
import { TRUST_ADMIN } from "src/helpers/userTypes";

describe("trust-admin/managers", () => {
  let res;
  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  it("redirects to login page if not authenticated", async () => {
    // Arrange
    const anonymousReq = {
      headers: {
        cookie: "",
      },
    };
    // Act
    await getServerSideProps({ req: anonymousReq, res });

    // Assert
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/trust-admin/login",
    });
  });

  it("retrieves managers", async () => {
    // Arrange
    const trustId = 1;
    const expectedManagersArray = [
      {
        uuid: "1BBE43B3-4B2E-443E-8399-8299F22AB139",
        email: "nhs-manager1@nhs.co.uk",
        status: "active",
      },
      {
        uuid: "F8F800FE-7A7E-4419-BA6F-7EFDD7871331",
        email: "nhs-manager2@nhs.co.uk",
        status: "disabled",
      },
    ];
    const authenticatedReq = {
      headers: {
        cookie: "token=123",
      },
    };
    const tokenProvider = {
      validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: trustId })),
    };
    const retrieveTrustByIdSuccessStub = jest.fn(async () => ({
      trust: { name: "Doggo Trust" },
      error: null,
    }));
    const retrieveManagersByOrgIdSuccessSpy = jest.fn(async () => ({
      managers: expectedManagersArray,
      error: null,
    }));
    const container = {
      getRetrieveTrustById: () => retrieveTrustByIdSuccessStub,
      getRetrieveManagersByOrgId: () => retrieveManagersByOrgIdSuccessSpy,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };
    // Act
    const { props } = await getServerSideProps({
      req: authenticatedReq,
      res,
      container,
    });
    const actualManagerArray = props.managers;
    // Assert
    expect(retrieveManagersByOrgIdSuccessSpy).toHaveBeenCalledWith(trustId);
    expect(actualManagerArray.length).toEqual(2);
    actualManagerArray.forEach((manager, idx) => {
      expect(manager.uuid).toEqual(expectedManagersArray[idx].uuid);
      expect(manager.email).toEqual(expectedManagersArray[idx].email);
      expect(manager.status).toEqual(expectedManagersArray[idx].status);
    });
  });
});
