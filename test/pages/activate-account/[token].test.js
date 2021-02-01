import { getServerSideProps } from "../../../pages/activate-account/[token]";

describe("/activate-account/[token]", () => {
  describe("getServerSideProps", () => {
    let user;
    let organisation;

    beforeEach(() => {
      user = {
        email: "test@email.com",
        user_id: 1,
        organisation_id: 1,
      };

      organisation = {
        id: 1,
        name: "Test Organisation",
      };
    });

    it("returns the user email address as a props", async () => {
      const verifySignUpLinkSpy = jest.fn(async () => {
        return { user, error: null };
      });

      const activateManagerAndOrganisation = jest.fn(async () => {
        return { organisation, error: null };
      });

      const container = {
        getVerifySignUpLink: () => verifySignUpLinkSpy,
        getActivateManagerAndOrganisation: () => activateManagerAndOrganisation,
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.email).toEqual("test@email.com");
      expect(props.error).toBeNull();
      expect(verifySignUpLinkSpy).toHaveBeenCalledWith("valid token");
    });

    it("returns the organisation name address as a props", async () => {
      const verifySignUpLink = jest.fn(async () => {
        return { user, error: null };
      });

      const activateManagerAndOrganisationSpy = jest.fn(async () => {
        return { organisation, error: null };
      });

      const container = {
        getVerifySignUpLink: () => verifySignUpLink,
        getActivateManagerAndOrganisation: () =>
          activateManagerAndOrganisationSpy,
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.organisationName).toEqual("Test Organisation");
      expect(props.error).toBeNull();
      expect(activateManagerAndOrganisationSpy).toHaveBeenCalledWith({
        userId: 1,
        organisationId: 1,
      });
    });

    it("returns an error as props if there is an error verifying link", async () => {
      const verifySignUpLink = jest.fn(async () => {
        return { user: null, error: "There is a link error" };
      });

      const container = {
        getVerifySignUpLink: () => verifySignUpLink,
        getActivateManagerAndOrganisation: jest.fn(),
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.email).toBeNull();
      expect(props.organisationName).toBeNull();
      expect(props.error).toEqual("There is a link error");
    });

    it("returns an error as props if there is an error activating account", async () => {
      const verifySignUpLink = jest.fn(async () => {
        return { user, error: null };
      });

      const activateManagerAndOrganisationSpy = jest.fn(async () => {
        return { organisation: null, error: "There is an activation error" };
      });

      const container = {
        getVerifySignUpLink: () => verifySignUpLink,
        getActivateManagerAndOrganisation: () =>
          activateManagerAndOrganisationSpy,
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.email).toBeNull();
      expect(props.organisationName).toBeNull();
      expect(props.error).toEqual("There was an error");
    });
  });
});
