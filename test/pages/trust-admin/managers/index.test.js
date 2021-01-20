import { getServerSideProps } from "../../../../pages/trust-admin/managers/index";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";

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

  it("retrieves organisation, managers list and error (from props) if authenticated", async () => {
    // Arrange
    const orgId = 1;
    const expectedOrganisationName = "Doggo Trust";
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
      validate: jest.fn(() => ({ type: TRUST_ADMIN, trustId: orgId })),
    };
    const retrieveOrganisationByIdSuccessStub = jest.fn(async () => ({
      organisation: { name: expectedOrganisationName },
      error: null,
    }));
    const retrieveManagersByOrgIdSuccessSpy = jest.fn(async () => ({
      managers: expectedManagersArray,
      error: null,
    }));
    const container = {
      getRetrieveOrganisationById: () => retrieveOrganisationByIdSuccessStub,
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
    const actualOrganisation = props.organisation;
    const error = props.error;
    // Assert
    expect(retrieveOrganisationByIdSuccessStub).toHaveBeenCalledWith(orgId);
    expect(actualOrganisation.name).toEqual(expectedOrganisationName);
    expect(retrieveManagersByOrgIdSuccessSpy).toHaveBeenCalledWith(orgId);
    expect(actualManagerArray.length).toEqual(2);
    actualManagerArray.forEach((manager, idx) => {
      expect(manager.uuid).toEqual(expectedManagersArray[idx].uuid);
      expect(manager.email).toEqual(expectedManagersArray[idx].email);
      expect(manager.status).toEqual(expectedManagersArray[idx].status);
    });
    expect(error).toBeNull();
  });
});
