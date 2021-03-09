import verifyUserLogin from "../../src/usecases/verifyUserLogin";
import logger from "../../logger";

describe("verifyUserLogin", () => {
  describe("Given an email or password is not defined", () => {
    it("Returns an email is not defined error if email is not defined", async () => {
      // Arrange
      const getVerifyUserLoginGateway = jest.fn();
      const email = "";
      const password = "password";

      // Act
      const {
        validUser,
        trust_id,
        type,
        user_id,
        error,
      } = await verifyUserLogin({ getVerifyUserLoginGateway, logger })(email, password);

      // Assert
      expect(validUser).toEqual(false);
      expect(trust_id).toBeNull();
      expect(type).toBeNull();
      expect(user_id).toBeNull();
      expect(error).toEqual("email is not defined");
    });

    it("Returns a password is not defined error if password is not defined", async () => {
      // Arrange
      const getVerifyUserLoginGateway = jest.fn();
      const email = "test@email.co.uk";
      const password = "";

      // Act
      const {
        validUser,
        trust_id,
        type,
        user_id,
        error,
      } = await verifyUserLogin({ getVerifyUserLoginGateway, logger })(email, password);

      // Assert
      expect(validUser).toEqual(false);
      expect(trust_id).toBeNull();
      expect(type).toBeNull();
      expect(user_id).toBeNull();
      expect(error).toEqual("password is not defined");
    });
  });

  describe("Given a admin tries to login with email and password", () => {
    it("Returns valid user, type, and user_id if the email and password are valid", async () => {
      // Arrange
      const getVerifyUserLoginGatewaySpy = jest.fn().mockReturnValue({
        validUser: true,
        trust_id: null,
        type: "admin",
        user_id: 1,
        error: null,
      });
      const getVerifyUserLoginGateway = jest.fn(() => {
        return getVerifyUserLoginGatewaySpy;
      });

      const email = "test-admin@email.co.uk";
      const password = "validPassword";

      // Act
      const {
        validUser,
        trust_id,
        type,
        user_id,
        error,
      } = await verifyUserLogin({ getVerifyUserLoginGateway, logger })(email, password);

      // Assert
      expect(validUser).toEqual(true);
      expect(trust_id).toBeNull();
      expect(type).toEqual("admin");
      expect(user_id).toEqual(1);
      expect(error).toBeNull();
      expect(getVerifyUserLoginGatewaySpy).toHaveBeenCalledWith(
        "test-admin@email.co.uk",
        "validPassword"
      );
    });

    it("Returns error if the passwords don't match", async () => {
      // Arrange
      const getVerifyUserLoginGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          validUser: false,
          trust_id: null,
          type: null,
          user_id: null,
          error: "Incorrect email or password",
        });
      });

      const email = "test-admin@email.co.uk";
      const password = "invalidPassword";

      // Act
      const {
        validUser,
        trust_id,
        type,
        user_id,
        error,
      } = await verifyUserLogin({ getVerifyUserLoginGateway, logger })(email, password);

      // Assert
      expect(validUser).toEqual(false);
      expect(trust_id).toBeNull();
      expect(type).toBeNull();
      expect(user_id).toBeNull();
      expect(error).toEqual("Incorrect email or password");
    });
  });

  describe("Given a manager tries to login with email and password", () => {
    it("Returns valid user, type, trust_id and user_id if the email and password are valid", async () => {
      // Arrange
      const getVerifyUserLoginGatewaySpy = jest.fn().mockReturnValue({
        validUser: true,
        trust_id: 1,
        type: "manager",
        user_id: 1,
        error: null,
      });
      const getVerifyUserLoginGateway = jest.fn(() => {
        return getVerifyUserLoginGatewaySpy;
      });

      const email = "test-manager@email.co.uk";
      const password = "validPassword";

      // Act
      const {
        validUser,
        trust_id,
        type,
        user_id,
        error,
      } = await verifyUserLogin({ getVerifyUserLoginGateway, logger })(email, password);

      // Assert
      expect(validUser).toEqual(true);
      expect(trust_id).toEqual(1);
      expect(type).toEqual("manager");
      expect(user_id).toEqual(1);
      expect(error).toBeNull();
      expect(getVerifyUserLoginGatewaySpy).toHaveBeenCalledWith(
        "test-manager@email.co.uk",
        "validPassword"
      );
    });

    it("Returns error if the passwords don't match", async () => {
      // Arrange
      const getVerifyUserLoginGateway = jest.fn(() => {
        return jest.fn().mockReturnValue({
          validUser: false,
          trust_id: null,
          type: null,
          user_id: null,
          error: "Incorrect email or password",
        });
      });

      const email = "test-manager@email.co.uk";
      const password = "invalidPassword";

      // Act
      const {
        validUser,
        trust_id,
        type,
        user_id,
        error,
      } = await verifyUserLogin({ getVerifyUserLoginGateway, logger })(email, password);

      // Assert
      expect(validUser).toEqual(false);
      expect(trust_id).toBeNull();
      expect(type).toBeNull();
      expect(user_id).toBeNull();
      expect(error).toEqual("Incorrect email or password");
    });
  });
});
