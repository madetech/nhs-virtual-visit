import { getServerSideProps } from "../../pages/visits/[id]";
import isGuid from "../../src/helpers/isGuid";

jest.mock("../../src/hooks/useScript", () => ({
  __esModule: true,
  default: () => [true, false],
}));

describe("call", () => {
  describe("getServerSideProps", () => {
    let getVerifyCallPasswordSpy;
    let getUserIsAuthenticatedSpy;
    let container;
    let res;
    const req = {
      headers: {
        cookie: "",
      },
    };

    beforeEach(() => {
      getVerifyCallPasswordSpy = jest.fn((callId, password) => ({
        validCallPassword: password === "securePassword",
        error: null,
      }));
      getUserIsAuthenticatedSpy = jest.fn().mockResolvedValue(false);
      container = {
        getVerifyCallPassword: () => getVerifyCallPasswordSpy,
        getUserIsAuthenticated: () => getUserIsAuthenticatedSpy,
        getRetrieveVisitByCallId: () => () => ({
          scheduledCall: { id: 1, provider: "whereby" },
        }),
      };
      res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
        end: jest.fn(),
      };
    });

    it("returns callId when the password is valid", async () => {
      const { props } = await getServerSideProps({
        query: {
          callPassword: "securePassword",
          id: 1,
        },
        container,
        res,
        req,
      });
      expect(getVerifyCallPasswordSpy).toHaveBeenCalledWith(
        1,
        "securePassword"
      );
      expect(props.callId).toEqual(1);
    });

    it("returns callId when the password is invalid, but the user is authenticated", async () => {
      getUserIsAuthenticatedSpy.mockResolvedValue(true);
      const { props } = await getServerSideProps({
        query: {
          callPassword: undefined,
          id: 1,
        },
        container,
        res,
        req,
      });
      expect(getVerifyCallPasswordSpy).toHaveBeenCalledWith(1, undefined);
      expect(props.callId).toEqual(1);
    });

    it("redirects when password is invalid, and the user is unauthenticated", async () => {
      await getServerSideProps({
        query: {
          callPassword: "fakeCode",
          id: 1,
        },
        container,
        res,
        req,
      });

      expect(getUserIsAuthenticatedSpy).toHaveBeenCalled();
      expect(getVerifyCallPasswordSpy).toHaveBeenCalledWith(1, "fakeCode");
      expect(res.writeHead).toHaveBeenCalledWith(307, { Location: "/error" });
    });

    it("returns sessionId", async () => {
      const { props } = await getServerSideProps({
        query: {
          callPassword: "securePassword",
          id: 1,
        },
        container,
        res,
        req,
      });

      expect(isGuid(props.sessionId)).toBeTruthy();
    });

    it("returns visitId", async () => {
      const { props } = await getServerSideProps({
        query: {
          callPassword: "securePassword",
          id: 1,
        },
        container,
        res,
        req,
      });

      expect(props.visitId).toEqual(1);
    });
  });
});
