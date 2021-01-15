import retrieveEmailAndHashedPassword from "../../../src/gateways/MsSQL/retrieveEmailAndHashedPassword";
import MsSQL from "../../../src/gateways/MsSQL";

jest.mock("../../../src/gateways/MsSQL");

describe("retrieveEmailAndHashedPassword", () => {
  it("errors if no email is present", async () => {
    const email = "";

    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(email);

    expect(emailAddress).toBeFalsy();
    expect(hashedPassword).toBeFalsy();
    expect(error).toEqual("email is not defined");
  });

  it("returns the email address and hashed password with valid email", async () => {
    const inputSpy = jest.fn().mockReturnThis();

    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: inputSpy,
        query: jest.fn().mockReturnValue({
          recordset: [
            {
              emailAddress: "nhs-admin@nhs.co.uk",
              hashedPassword: "hashedPassword",
            },
          ],
        }),
      };
    });

    const email = "nhs-admin@nhs.co.uk";

    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(email);

    expect(emailAddress).toEqual("nhs-admin@nhs.co.uk");
    expect(hashedPassword).toEqual("hashedPassword");
    expect(error).toBeNull();
    expect(inputSpy).toHaveBeenCalledWith("email", "nhs-admin@nhs.co.uk");
  });

  it("errors if no records are found for a given email", async () => {
    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockReturnValue({ recordset: [] }),
      };
    });

    const email = "invalid-email@nhs.co.uk";

    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(email);

    expect(emailAddress).toBeFalsy();
    expect(hashedPassword).toBeFalsy();
    expect(error).toEqual("Email could not be found in database");
  });

  it("errors if there is a problem with the database call", async () => {
    MsSQL.getConnectionPool = jest.fn(() => {
      return {
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn(() => {
          throw new Error("DB Error!");
        }),
      };
    });

    const email = "nhs-admin@nhs.co.uk";

    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(email);

    expect(emailAddress).toBeFalsy();
    expect(hashedPassword).toBeFalsy();
    expect(error).toEqual("Error: DB Error!");
  });
});
