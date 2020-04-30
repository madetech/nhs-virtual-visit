import React from "react";
import { render } from "@testing-library/react";
import Call from "../../pages/visitors/[id]/name";
import Start, { getServerSideProps } from "../../pages/visitors/[id]/name";

jest.mock("../../src/hooks/useScript", () => ({
  __esModule: true,
  default: () => [true, false],
}));

describe("call", () => {
  let spy;
  let res;
  const container = {
    getDb: () =>
      Promise.resolve({
        any: () => [
          {
            id: 1,
            call_password: "securePassword",
          },
        ],
      }),
  };
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
    it("returns a valid call id", async () => {
      const { props } = await getServerSideProps({
        query: {
          callPassword: "securePassword",
          id: 1,
        },
        container,
        res,
      });
      expect(res.writeHead).not.toHaveBeenCalled();
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
      expect(res.writeHead).toHaveBeenCalledWith(307, { Location: "/error" });
    });
  });
});
