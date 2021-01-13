import verifyUserLogin from "../../../src/gateways/MsSQL/verifyUserLogin";
import MsSQL from "../../../src/gateways/MsSQL";

jest.mock("../../../src/gateways/MsSQL");

describe("verifyUserLogin", () => {
  xit("returns a user when a valid email and password are entered", async () => {
    const querySpy = jest.fn().mockReturnValue({
      recordset: [
        {
          organisation_id: 1,
          password: "password",
          type: "manager",
        },
      ],
    });

    const mssql = await MsSQL.getConnectionPool.mockImplementation(() =>
      jest.fn()
    );
    //   return {
    //     // request: jest.fn(() => console.log('request')),
    //     input: jest.fn(() => console.log("input")),
    //     query: querySpy,
    //   };
    // });

    const email = "test@email.com";
    const password = "password";

    const db = mssql
      .request()
      .input("email", email)
      .query(() => {
        return querySpy;
      });

    console.log(db);

    await verifyUserLogin(email, password);
  });
});
