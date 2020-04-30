import React from "react";
import { render } from "@testing-library/react";
import Call, { getServerSideProps } from "../../pages/visits/[id]";

jest.mock("../../src/hooks/useScript", () => ({
  __esModule: true,
  default: () => [true, false],
}));

describe("call", () => {
  let spy;
  beforeEach(() => {
    spy = jest.fn();

    window.JitsiMeetExternalAPI = spy;
  });

  describe("with a call id", () => {
    beforeEach(() => {
      render(<Call callId="TestCallId" />);
    });

    it("configures Jitsi toolbar buttons", () => {
      expect(spy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"],
          },
        })
      );
    });

    it("uses the call id as the room name", () => {
      expect(spy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          roomName: "TestCallId",
        })
      );
    });
  });

  describe("without a call id", () => {
    it("shows an error page", () => {
      render(<Call />);

      expect(spy).not.toHaveBeenCalled();
    });
  });

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
      getUserIsAuthenticatedSpy = jest.fn().mockReturnValue(false);
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
      getUserIsAuthenticatedSpy.mockReturnValueOnce(true);
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
      expect(getVerifyCallPasswordSpy).toHaveBeenCalledWith(1, "fakeCode");
      expect(res.writeHead).toHaveBeenCalledWith(307, { Location: "/error" });
    });
  });
});
