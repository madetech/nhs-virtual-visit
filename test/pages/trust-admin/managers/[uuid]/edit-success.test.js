import { getServerSideProps } from "../../../../../pages/trust-admin/managers/[uuid]/edit-success";
import { TRUST_ADMIN } from "../../../../../src/helpers/userTypes";

describe("/trust-admin/managers/[uuid]/edit-success", () => {
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
  it("retrieves trust, manager and error (from props) if authenticated", async () => {
    // Arrange
    const orgId = 1;
    const uuid = "1BBE43B3-4B2E-443E-8399-8299F22AB139";
    const expectedManager = {
      uuid: "1BBE43B3-4B2E-443E-8399-8299F22AB139",
      email: "nhs-manager1@nhs.co.uk",
      status: "active",
    };
    const expectedOrganisationName = "Doggo Trust";

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
    const retrieveManagerByUuidSuccessSpy = jest.fn(async () => ({
      manager: expectedManager,
      error: null,
    }));
    const container = {
      getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
      getRetrieveManagerByUuid: () => retrieveManagerByUuidSuccessSpy,
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };
    // Act
    const {
      props: { manager, organisation, error },
    } = await getServerSideProps({
      req: authenticatedReq,
      res,
      query: { uuid },
      container,
    });
    // Assert
    expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(orgId);
    expect(organisation.name).toEqual(expectedOrganisationName);
    expect(retrieveManagerByUuidSuccessSpy).toHaveBeenCalledWith(uuid);
    expect(manager).toEqual(expectedManager);
    expect(error).toBeNull();
  });
});
