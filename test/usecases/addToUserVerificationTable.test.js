import addToUserVerificationTable from "../../src/usecases/addToUserVerificationTable";
import logger from "../../logger";

describe("addToUserVerificationTable", () => {
  let newUser;
  let getAddToUserVerificationTableGateway;

  beforeEach(() => {
    newUser = {
      user_id: 1,
      type: "resetPassword",
    };

    getAddToUserVerificationTableGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        verifyUser: {
          id: 1,
          created_at: "01/01/2001",
          user_id: 1,
          type: "resetPassword",
          code: "uuid",
          hash: "hashedUuid",
          verified: 0,
        },
        error: null,
      });
    });
  });

  it("returns an error if no user_id passed in", async () => {
    newUser = {
      ...newUser,
      user_id: "",
    };

    const { verifyUser, error } = await addToUserVerificationTable({
      getAddToUserVerificationTableGateway,
      logger
    })(newUser);

    expect(verifyUser).toBeNull();
    expect(error).toEqual("user_id is not defined");
  });

  it("returns an error if no password is passed in", async () => {
    newUser = {
      ...newUser,
      type: "",
    };

    const { verifyUser, error } = await addToUserVerificationTable({
      getAddToUserVerificationTableGateway,
      logger
    })(newUser);

    expect(verifyUser).toBeNull();
    expect(error).toEqual("type is not defined");
  });

  it("creates an new user in the user verification table and returns it", async () => {
    const { verifyUser, error } = await addToUserVerificationTable({
      getAddToUserVerificationTableGateway,
      logger
    })(newUser);

    const expectedResponse = {
      id: 1,
      created_at: "01/01/2001",
      user_id: 1,
      type: "resetPassword",
      code: "uuid",
      hash: "hashedUuid",
      verified: 0,
    };

    expect(verifyUser).toEqual(expectedResponse);
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    getAddToUserVerificationTableGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        verifyUser: null,
        error: "There is an error with the database",
      });
    });

    const { verifyUser, error } = await addToUserVerificationTable({
      getAddToUserVerificationTableGateway,
      logger
    })(newUser);

    expect(verifyUser).toBeNull();
    expect(error).toEqual("There is an error with the database");
  });
});
