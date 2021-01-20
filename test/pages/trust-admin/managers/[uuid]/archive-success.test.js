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
    const orgId = 1;
    const expectedManagerEmail = "nhs-manager1@nhs.co.uk";
    const expectedTrustName = "Doggo Trust";
    const authenticatedReq = {
      headers: {
        cookie: "token=123",
      },
    };
    const tokenProvider = {
      validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
    };
    const retrieveOrganisationByIdSpy = jest.fn(async () => ({
      organisation: { name: "Doggo Trust" },
      error: null,
    }));

    const container = {
      getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };
    // Act
    const {
      props: { managerEmail, organisation, error },
    } = await getServerSideProps({
      req: authenticatedReq,
      res,
      query: { email: expectedManagerEmail },
      container,
    });
    // Assert
    expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
    expect(organisation.name).toEqual(expectedTrustName);
    expect(managerEmail).toEqual(expectedManagerEmail);
    expect(error).toBeNull();
  });
});
