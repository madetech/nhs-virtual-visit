import React from "react";
import { render } from "@testing-library/react";
import Call from "../../pages/visitors/[id]/start";
import { getServerSideProps } from "../../pages/visitors/[id]/start";

jest.mock("../../src/hooks/useScript", () => ({
  __esModule: true,
  default: () => [true, false],
}));

describe("call", () => {
  let spy;
  let res;
  beforeEach(() => {
    spy = jest.fn();
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      end: jest.fn(),
    };
    window.JitsiMeetExternalAPI = spy;
  });

  describe("with a call id", () => {
    beforeEach(() => {
      render(<Call id="TestCallId" callPassword="securePassword" />);
    });
  });

  describe("without a call id", () => {
    it("shows an error page", () => {
      render(<Call />);

      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe("without a call password", () => {
    it("shows an error page", () => {
      render(<Call id="TestCallId" />);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("getServerSideProps", () => {
    let getVerifyCallPasswordSpy;
    let container;

    beforeEach(() => {
      getVerifyCallPasswordSpy = jest.fn((callId, password) => ({
        validCallPassword: password === "securePassword",
        error: null,
      }));
      container = {
        getVerifyCallPassword: () => getVerifyCallPasswordSpy,
      };
    });

    it("returns the call id when password is correct", async () => {
      const { props } = await getServerSideProps({
        query: {
          callPassword: "securePassword",
          id: 1,
        },
        container,
        res,
      });
      expect(getVerifyCallPasswordSpy).toHaveBeenCalledWith(
        1,
        "securePassword"
      );
      expect(props.callId).toEqual(1);
    });

    it("given an invalid passcode, the user should be redirected", async () => {
      await getServerSideProps({
        query: {
          callPassword: "fakeCode",
          id: 1,
        },
        container,
        res,
      });
      expect(getVerifyCallPasswordSpy).toHaveBeenCalledWith(1, "fakeCode");
      expect(res.writeHead).toHaveBeenCalledWith(307, { Location: "/error" });
    });
  });
});
