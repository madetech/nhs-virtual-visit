import createManager from "../../src/usecases/createManager";
import logger from "../../logger";

describe("createManager", () => {
  let newManager;
  let getInsertManagerGateway;

  beforeEach(() => {
    newManager = {
      email: "nhs-manager@nhs.co.uk",
      password: "password",
      organisationId: 1,
    };

    getInsertManagerGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        user: {
          id: 1,
          email: "nhs-manager@nhs.co.uk",
          created_at: "01/01/2001",
          updated_at: "01/01/2001",
          type: "manager",
          organisation_id: 1,
          uuid: "uuid",
          status: 0,
        },
        error: null,
      });
    });
  });

  it("returns an error if no email passed in", async () => {
    newManager = {
      ...newManager,
      email: "",
    };

    const { user, error } = await createManager({
      getInsertManagerGateway,
      logger
    })(newManager);

    expect(user).toBeNull();
    expect(error).toEqual("email is not defined");
  });

  it("returns an error if no password is passed in", async () => {
    newManager = {
      ...newManager,
      password: "",
    };

    const { user, error } = await createManager({
      getInsertManagerGateway,
      logger
    })(newManager);

    expect(user).toBeNull();
    expect(error).toEqual("password is not defined");
  });

  it("returns an error if no organisationId is passed in", async () => {
    newManager = {
      ...newManager,
      organisationId: "",
    };

    const { user, error } = await createManager({
      getInsertManagerGateway,
      logger
    })(newManager);

    expect(user).toBeNull();
    expect(error).toEqual("organisationId is not defined");
  });

  it("creates an new manager and returns it", async () => {
    const { user, error } = await createManager({
      getInsertManagerGateway,
      logger
    })(newManager);

    const expectedResponse = {
      id: 1,
      email: "nhs-manager@nhs.co.uk",
      created_at: "01/01/2001",
      updated_at: "01/01/2001",
      type: "manager",
      organisation_id: 1,
      uuid: "uuid",
      status: 0,
    };

    expect(user).toEqual(expectedResponse);
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    getInsertManagerGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        user: null,
        error: "There is an error with the database",
      });
    });

    const { user, error } = await createManager({
      getInsertManagerGateway,
      logger
    })(newManager);

    expect(user).toBeNull();
    expect(error).toEqual("There is an error with the database");
  });
});
