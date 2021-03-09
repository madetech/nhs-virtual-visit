import retrieveManagerByEmail from "../../src/usecases/retrieveManagerByEmail";
import logger from "../../logger";

describe("retrieveManagerByEmail", () => {
  it("returns an error if there is no email", async () => {
    const email = "";
    const getRetrieveManagerByEmailGateway = jest.fn();

    const { manager, error } = await retrieveManagerByEmail({
      getRetrieveManagerByEmailGateway,
      logger
    })(email);

    expect(manager).toBeNull();
    expect(error).toEqual("email is not defined");
  });

  it("returns a manager for a valid email", async () => {
    const getRetrieveManagerByEmailGatewaySpy = jest.fn().mockReturnValue({
      manager: {
        id: 1,
        email: "nhs-manager@nhs.co.uk",
        uuid: "uuid",
        type: "manager",
      },
      error: null,
    });
    const getRetrieveManagerByEmailGateway = jest.fn(() => {
      return getRetrieveManagerByEmailGatewaySpy;
    });

    const expectedResponse = {
      id: 1,
      email: "nhs-manager@nhs.co.uk",
      uuid: "uuid",
      type: "manager",
    };

    const email = "nhs-manager@nhs.co.uk";

    const { manager, error } = await retrieveManagerByEmail({
      getRetrieveManagerByEmailGateway,
      logger
    })(email);

    expect(manager).toEqual(expectedResponse);
    expect(error).toBeNull();
    expect(getRetrieveManagerByEmailGatewaySpy).toHaveBeenCalledWith(
      "nhs-manager@nhs.co.uk"
    );
  });

  it("errors if there is a problem with the database call", async () => {
    const getRetrieveManagerByEmailGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        manager: null,
        error: "There is an error with the database",
      });
    });

    const email = "nhs-manager@nhs.co.uk";
    const { manager, error } = await retrieveManagerByEmail({
      getRetrieveManagerByEmailGateway,
      logger
    })(email);

    expect(manager).toBeNull();
    expect(error).toEqual("There is an error with the database");
  });
});
