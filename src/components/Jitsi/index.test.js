import React from "react";
import { render } from "@testing-library/react";
import Jitsi from "./index";

jest.mock("../../../src/hooks/useScript", () => () => {
  return [true, false];
});

describe("Jitsi", () => {
  describe("with a call id", () => {
    it("configures Jitsi toolbar buttons", () => {
      let spy = jest.fn();
      window.JitsiMeetExternalAPI = spy;

      render(<Jitsi callId="TestCallId" />);

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
      let spy = jest.fn();
      window.JitsiMeetExternalAPI = spy;

      render(<Jitsi callId="TestCallId" />);

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
      let spy = jest.fn();
      window.JitsiMeetExternalAPI = spy;

      render(<Jitsi />);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
