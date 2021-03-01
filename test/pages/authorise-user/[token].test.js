import { getServerSideProps } from "../../../pages/authorise-user/[token]";

describe("/authorise-user/[token]", () => {
  describe("getServerSideProps", () => {
    let user;
    let organisation;

    beforeEach(() => {
      user = {
        email: "test@email.com",
        hash: "hash",
        organisation_id: 1,
      };

      organisation = {
        id: 1,
        name: "Test Organisation",
      };
    });

    it("returns the user email address as a props", async () => {
      const verifyTimeSensitiveLinkSpy = jest.fn(async () => {
        return { user, error: null };
      });
      const updateUserVerificationToVerifiedSpy = jest.fn();

      const retrieveOrganisationById = jest.fn(async () => {
        return { organisation, error: null };
      });

      const container = {
        getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLinkSpy,
        getUpdateUserVerificationToVerified: () => updateUserVerificationToVerifiedSpy,
        getRetrieveOrganisationById: () => retrieveOrganisationById,
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.email).toEqual("test@email.com");
      expect(props.error).toBeNull();
      expect(verifyTimeSensitiveLinkSpy).toHaveBeenCalledWith("valid token");
      expect(updateUserVerificationToVerifiedSpy).toHaveBeenCalledWith({ hash: "hash" });
    });

    it("returns the organisation name address as a props", async () => {
      const verifyTimeSensitiveLink = jest.fn(async () => {
        return { user, error: null };
      });

      const updateUserVerificationToVerified = jest.fn();

      const retrieveOrganisationByIdSpy = jest.fn(async () => {
        return { organisation, error: null };
      });

      const container = {
        getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLink,
        getUpdateUserVerificationToVerified: () => updateUserVerificationToVerified,
        getRetrieveOrganisationById: () => retrieveOrganisationByIdSpy,
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.organisationName).toEqual("Test Organisation");
      expect(props.error).toBeNull();
      expect(retrieveOrganisationByIdSpy).toHaveBeenCalledWith(1);
    });

    it("returns an error as props if there is an error verifying link", async () => {
      const verifyTimeSensitiveLink = jest.fn(async () => {
        return { user: null, error: "There is a link error" };
      });

      const updateUserVerificationToVerified = jest.fn();

      const retrieveOrganisationById = jest.fn(async () => {
        return { organisation, error: null };
      });

      const container = {
        getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLink,
        getUpdateUserVerificationToVerified: () => updateUserVerificationToVerified,
        getRetrieveOrganisationById: () => retrieveOrganisationById,
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

    it("if there is an error retrieving organisation, it returns an organisationName of undefined", async () => {
      const verifyTimeSensitiveLink = jest.fn(async () => {
        return { user, error: null };
      });

      const updateUserVerificationToVerified = jest.fn();

      const retrieveOrganisationById = jest.fn(async () => {
        return { organisation: undefined, error: "There is an error" };
      });

      const container = {
        getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLink,
        getUpdateUserVerificationToVerified: () => updateUserVerificationToVerified,
        getRetrieveOrganisationById: () => retrieveOrganisationById,
      };

      const { props } = await getServerSideProps({
        query: {
          token: "valid token",
        },
        container,
      });

      expect(props.organisationName).toBeUndefined();
      expect(props.error).toBeNull();
    });
  });
});
