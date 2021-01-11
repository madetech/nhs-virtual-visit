import { getServerSideProps } from "pages/trust-admin/managers/[uuid]/archive-confirmation";
import { TRUST_ADMIN } from "src/helpers/userTypes";

describe("trust-admin/managers/[uuid]/archive-confirmation", () => {
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
  it("retrieves trust name and manager by uuid if authenticated", async () => {
    // Arrange
    const trustId = 1;
    const uuid = "1BBE43B3-4B2E-443E-8399-8299F22AB139";
    const expectedManager = {
      uuid: "1BBE43B3-4B2E-443E-8399-8299F22AB139",
      email: "nhs-manager1@nhs.co.uk",
      status: "active",
    };
    const expectedTrustName = "Doggo Trust";

    const authenticatedReq = {
      headers: {
        cookie: "token=123",
      },
    };
    const tokenProvider = {
      validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId })),
    };
    const retrieveTrustByIdSuccessStub = jest.fn(async () => ({
      trust: { name: expectedTrustName },
      error: null,
    }));
    const retrieveManagerByUuidSuccessSpy = jest.fn(async () => ({
      manager: expectedManager,
      error: null,
    }));
    const container = {
      getRetrieveTrustById: () => retrieveTrustByIdSuccessStub,
      getRetrieveManagerByUuid: () => retrieveManagerByUuidSuccessSpy,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };
    // Act
    const { props } = await getServerSideProps({
      req: authenticatedReq,
      res,
      query: { uuid },
      container,
    });
    const actualManager = props.manager;
    const actualTrust = props.trust;
    // Assert
    expect(retrieveTrustByIdSuccessStub).toHaveBeenCalledWith(trustId);
    expect(actualTrust.name).toEqual(expectedTrustName);
    expect(retrieveManagerByUuidSuccessSpy).toHaveBeenCalledWith(uuid);
    expect(actualManager.uuid).toEqual(expectedManager.uuid);
    expect(actualManager.email).toEqual(expectedManager.email);
    expect(actualManager.status).toEqual(expectedManager.status);
  });
});
