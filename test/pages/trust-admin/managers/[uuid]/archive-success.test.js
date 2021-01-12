import { getServerSideProps } from "../../../../../pages/trust-admin/managers/[uuid]/archive-success";
import { TRUST_ADMIN } from "../../../../../src/helpers/userTypes";

describe("trust-admin/managers/[uuid]/archive-success", () => {
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
  it("retrieves trust, manager email and error (from props) if authenticated", async () => {
    // Arrange
    const trustId = 1;
    const expectedManagerEmail = "nhs-manager1@nhs.co.uk";
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

    const container = {
      getRetrieveTrustById: () => retrieveTrustByIdSuccessStub,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };
    // Act
    const { props } = await getServerSideProps({
      req: authenticatedReq,
      res,
      query: { email: expectedManagerEmail },
      container,
    });
    const actualManagerEmail = props.managerEmail;
    const actualTrust = props.trust;
    const error = props.error;
    // Assert
    expect(retrieveTrustByIdSuccessStub).toHaveBeenCalledWith(trustId);
    expect(actualTrust.name).toEqual(expectedTrustName);
    expect(actualManagerEmail).toEqual(expectedManagerEmail);
    expect(error).toBeNull();
  });
});
