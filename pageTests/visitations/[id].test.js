import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import Call from "../../pages/visits/[id]";
import { RouterContext } from "next/dist/next-server/lib/router-context";

describe("call", () => {
  let spy;
  beforeEach(() => {
    spy = jest.fn();

    window.JitsiMeetExternalAPI = spy;
  });

  describe("with a call id", () => {
    beforeEach(() => {
      mount(<Call id="TestCallId" />);
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
      mount(<Call />);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
